'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useOfficeStore } from '@/lib/office/store'
import { eventBus } from '@/lib/office/eventBus'
import { AGENT_DEFINITIONS } from '@/lib/office/agents/definitions'
import { AgentId, AgentStatus } from '@/types/office'

interface SpeechBubble {
  id: string
  agentId: AgentId
  text: string
  screenX: number
  screenY: number
  visible: boolean
}

interface HandoffAnimation {
  sourcePos: THREE.Vector3
  targetPos: THREE.Vector3
  progress: number
  mesh: THREE.Mesh
  trailPoints: THREE.Vector3[]
  trailLine: THREE.Line
}

export function Office3D() {
  const mountRef = useRef<HTMLDivElement>(null)
  const store = useOfficeStore()
  const activeOffice = store.offices[store.activeOfficeId]
  const officeLightsOn = store.officeLightsOn
  const cameraZone = store.cameraZone

  const [speechBubbles, setSpeechBubbles] = useState<SpeechBubble[]>([])
  const [hoveredAgent, setHoveredAgent] = useState<AgentId | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Web Audio Context for subtle futuristic office sounds
  const audioCtxRef = useRef<AudioContext | null>(null)
  const playBlip = useCallback((freq = 580, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.16)
    } catch {
      // ignore audio errors
    }
  }, [soundEnabled])

  // Internal Three.js references
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    agentMeshes: Map<AgentId, THREE.Group>
    statusMeshes: Map<AgentId, THREE.Mesh>
    lights: {
      ambient: THREE.AmbientLight
      sun: THREE.DirectionalLight
      neonFill: THREE.PointLight
    }
    handoffs: HandoffAnimation[]
    targetCameraPos: THREE.Vector3 | null
    targetControlsTarget: THREE.Vector3 | null
  } | null>(null)

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x12100e)
    scene.fog = new THREE.FogExp2(0x12100e, 0.028)

    // Camera
    const aspect = container.clientWidth / container.clientHeight
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100)
    camera.position.set(0, 14, 18)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2.1
    controls.minDistance = 6
    controls.maxDistance = 32
    controls.target.set(0, 1, 0)

    // Lights
    const ambient = new THREE.AmbientLight(0xfff1e6, 0.65)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffeedd, 1.4)
    sun.position.set(12, 22, 10)
    sun.castShadow = true
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 60
    sun.shadow.camera.left = -16
    sun.shadow.camera.right = 16
    sun.shadow.camera.top = 16
    sun.shadow.camera.bottom = -16
    sun.shadow.bias = -0.0005
    scene.add(sun)

    const neonFill = new THREE.PointLight(0xfaae33, 1.2, 25)
    neonFill.position.set(0, 5, 0)
    scene.add(neonFill)

    // ==========================================
    // ARCHITECTURE: Floor & Department Zones
    // ==========================================
    // Main Floor
    const floorGeo = new THREE.PlaneGeometry(24, 20)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181412,
      roughness: 0.75,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Floor Grid Lines
    const gridHelper = new THREE.GridHelper(24, 24, 0xfaae33, 0x2e241c)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    // Department Zones: Rugs / Floor decals
    const createZoneFloor = (x: number, z: number, w: number, d: number, color: number, borderHex: number) => {
      const g = new THREE.Group()
      const rugGeo = new THREE.PlaneGeometry(w, d)
      const rugMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        metalness: 0.1,
      })
      const rug = new THREE.Mesh(rugGeo, rugMat)
      rug.rotation.x = -Math.PI / 2
      rug.position.set(x, 0.02, z)
      rug.receiveShadow = true
      g.add(rug)

      // Neon Border
      const edgeGeo = new THREE.EdgesGeometry(rugGeo)
      const edgeMat = new THREE.LineBasicMaterial({ color: borderHex, linewidth: 2 })
      const edge = new THREE.LineSegments(edgeGeo, edgeMat)
      edge.rotation.x = -Math.PI / 2
      edge.position.set(x, 0.025, z)
      g.add(edge)

      scene.add(g)
      return g
    }

    // 1. Dirección (Dora) - Top Center (Gold)
    createZoneFloor(0, -4.5, 7.5, 5, 0x24180e, 0xfaae33)

    // 2. Producto (Iván, Lucas, Eva) - Left (Sky Blue)
    createZoneFloor(-5.5, 0, 7.5, 8.5, 0x101b26, 0x38bdf8)

    // 3. Marketing & Copy (Sofía, Carlos) - Top Right (Violet/Pink)
    createZoneFloor(5.5, -1.5, 7.5, 5.5, 0x231124, 0xe879f9)

    // 4. Ecommerce & Art (Diego, Leo, Marco) - Center Right (Teal/Emerald)
    createZoneFloor(3.5, 1.8, 8, 4.5, 0x0f2420, 0x2dd4bf)

    // 5. Operaciones & Adquisición (Tomás, Marta, Nora) - Bottom (Amber/Emerald)
    createZoneFloor(0, 4.5, 12, 4.5, 0x1b1c14, 0xfacc15)

    // Center Hologram Pedestal for Product
    const pedestalGeo = new THREE.CylinderGeometry(0.8, 1, 0.4, 16)
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x261d18, metalness: 0.8, roughness: 0.3 })
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat)
    pedestal.position.set(0, 0.2, 0)
    pedestal.castShadow = true
    scene.add(pedestal)

    // Floating Holographic Product Symbol
    const holoGeo = new THREE.OctahedronGeometry(0.35, 0)
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0xfaae33,
      emissive: 0xfaae33,
      emissiveIntensity: 0.8,
      wireframe: true,
    })
    const holoMesh = new THREE.Mesh(holoGeo, holoMat)
    holoMesh.position.set(0, 1.1, 0)
    scene.add(holoMesh)

    // ==========================================
    // AGENT WORKSTATIONS (Desks & Avatars)
    // ==========================================
    const agentMeshes = new Map<AgentId, THREE.Group>()
    const statusMeshes = new Map<AgentId, THREE.Mesh>()

    Object.values(AGENT_DEFINITIONS).forEach((agent) => {
      const agentGroup = new THREE.Group()
      agentGroup.position.set(...agent.deskPosition)
      agentGroup.userData = { agentId: agent.id }

      // 1. Desk Table
      const deskTopGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9)
      const deskTopMat = new THREE.MeshStandardMaterial({
        color: agent.id === 'dora' ? 0x3d2110 : 0x2c2622,
        roughness: 0.4,
        metalness: 0.2,
      })
      const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat)
      deskTop.position.set(0, 0.72, 0)
      deskTop.castShadow = true
      deskTop.receiveShadow = true
      agentGroup.add(deskTop)

      // Desk Legs (Metallic)
      const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8)
      const legMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 })
      const legPositions = [
        [-0.7, 0.36, -0.35],
        [0.7, 0.36, -0.35],
        [-0.7, 0.36, 0.35],
        [0.7, 0.36, 0.35],
      ]
      legPositions.forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, ly, lz)
        leg.castShadow = true
        agentGroup.add(leg)
      })

      // 2. Monitor Screen
      const monitorStandGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.25, 8)
      const monitorStand = new THREE.Mesh(monitorStandGeo, legMat)
      monitorStand.position.set(0, 0.88, -0.2)
      agentGroup.add(monitorStand)

      const screenGeo = new THREE.BoxGeometry(0.65, 0.4, 0.03)
      const screenBezelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 })
      const screen = new THREE.Mesh(screenGeo, screenBezelMat)
      screen.position.set(0, 1.05, -0.2)
      agentGroup.add(screen)

      // Glowing Screen Face
      const screenGlowGeo = new THREE.PlaneGeometry(0.6, 0.35)
      const screenGlowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(agent.avatarColor),
      })
      const screenFace = new THREE.Mesh(screenGlowGeo, screenGlowMat)
      screenFace.position.set(0, 1.05, -0.18)
      agentGroup.add(screenFace)

      // Mini Keyboard
      const kbGeo = new THREE.BoxGeometry(0.4, 0.02, 0.16)
      const kbMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
      const kb = new THREE.Mesh(kbGeo, kbMat)
      kb.position.set(0, 0.77, 0.1)
      agentGroup.add(kb)

      // 3. Ergonomic Office Chair
      const chairSeatGeo = new THREE.BoxGeometry(0.5, 0.06, 0.45)
      const chairMat = new THREE.MeshStandardMaterial({
        color: agent.id === 'dora' ? 0x823513 : 0x1e1e1e,
        roughness: 0.6,
      })
      const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat)
      chairSeat.position.set(0, 0.48, 0.6)
      chairSeat.castShadow = true
      agentGroup.add(chairSeat)

      const chairBackGeo = new THREE.BoxGeometry(0.48, 0.55, 0.06)
      const chairBack = new THREE.Mesh(chairBackGeo, chairMat)
      chairBack.position.set(0, 0.78, 0.8)
      chairBack.castShadow = true
      agentGroup.add(chairBack)

      // 4. Stylized 3D Avatar (Head & Torso)
      const avatarGroup = new THREE.Group()
      avatarGroup.position.set(0, 0.8, 0.6)

      // Torso
      const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 12)
      const torsoMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(agent.avatarColor).multiplyScalar(0.7),
        roughness: 0.6,
      })
      const torso = new THREE.Mesh(torsoGeo, torsoMat)
      torso.position.y = 0.22
      torso.castShadow = true
      avatarGroup.add(torso)

      // Head
      const headGeo = new THREE.SphereGeometry(0.16, 16, 16)
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xf5d0b5,
        roughness: 0.5,
      })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.y = 0.55
      head.castShadow = true
      avatarGroup.add(head)

      // Headphones / Visor
      const visorGeo = new THREE.TorusGeometry(0.17, 0.03, 8, 16)
      const visorMat = new THREE.MeshStandardMaterial({ color: 0xfaae33, metalness: 0.9, roughness: 0.1 })
      const visor = new THREE.Mesh(visorGeo, visorMat)
      visor.position.set(0, 0.56, 0)
      visor.rotation.x = Math.PI / 2
      avatarGroup.add(visor)

      agentGroup.add(avatarGroup)

      // 5. Floating Status Indicator Beacon above head
      const statusGeo = new THREE.SphereGeometry(0.08, 12, 12)
      const statusMat = new THREE.MeshBasicMaterial({ color: 0x999999 })
      const statusMesh = new THREE.Mesh(statusGeo, statusMat)
      statusMesh.position.set(0, 1.7, 0.6)
      agentGroup.add(statusMesh)

      // Nameplate Tag on front of desk
      const tagGeo = new THREE.BoxGeometry(0.4, 0.1, 0.02)
      const tagMat = new THREE.MeshStandardMaterial({ color: 0xfaae33 })
      const tag = new THREE.Mesh(tagGeo, tagMat)
      tag.position.set(0, 0.62, -0.46)
      agentGroup.add(tag)

      scene.add(agentGroup)
      agentMeshes.set(agent.id, agentGroup)
      statusMeshes.set(agent.id, statusMesh)
    })

    threeRef.current = {
      scene,
      camera,
      renderer,
      controls,
      agentMeshes,
      statusMeshes,
      lights: { ambient, sun, neonFill },
      handoffs: [],
      targetCameraPos: null,
      targetControlsTarget: null,
    }

    // ==========================================
    // Raycasting for Mouse Hover & Selection
    // ==========================================
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      let hitAgent: AgentId | null = null
      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object
        while (parent && parent !== scene) {
          if (parent.userData?.agentId) {
            hitAgent = parent.userData.agentId
            break
          }
          parent = parent.parent
        }
        if (hitAgent) break
      }

      setHoveredAgent(hitAgent)
      container.style.cursor = hitAgent ? 'pointer' : 'default'
    }

    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return // only left click
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object
        while (parent && parent !== scene) {
          if (parent.userData?.agentId) {
            const clickedId = parent.userData.agentId as AgentId
            useOfficeStore.getState().selectAgent(clickedId)
            playBlip(720)

            // Zoom camera smoothly towards this agent desk
            const targetPos = AGENT_DEFINITIONS[clickedId].deskPosition
            if (threeRef.current) {
              threeRef.current.targetCameraPos = new THREE.Vector3(targetPos[0], targetPos[1] + 3.8, targetPos[2] + 4.8)
              threeRef.current.targetControlsTarget = new THREE.Vector3(targetPos[0], targetPos[1] + 1.1, targetPos[2])
            }
            return
          }
          parent = parent.parent
        }
      }
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)

    // ==========================================
    // Resize Handler
    // ==========================================
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // ==========================================
    // Animation Loop
    // ==========================================
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Rotate central hologram
      if (holoMesh) {
        holoMesh.rotation.y = elapsedTime * 0.8
        holoMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2
        holoMesh.position.y = 1.05 + Math.sin(elapsedTime * 2) * 0.05
      }

      // Smooth camera interpolation if tracking or zone change
      if (threeRef.current) {
        const { targetCameraPos, targetControlsTarget } = threeRef.current
        if (targetCameraPos) {
          camera.position.lerp(targetCameraPos, 0.05)
          if (camera.position.distanceTo(targetCameraPos) < 0.05) {
            threeRef.current.targetCameraPos = null
          }
        }
        if (targetControlsTarget) {
          controls.target.lerp(targetControlsTarget, 0.05)
          if (controls.target.distanceTo(targetControlsTarget) < 0.05) {
            threeRef.current.targetControlsTarget = null
          }
        }
      }

      // Animate Agent status beacons (pulse & glow)
      const currentOffice = useOfficeStore.getState().offices[useOfficeStore.getState().activeOfficeId]
      if (currentOffice && statusMeshes) {
        statusMeshes.forEach((statusMesh, agentId) => {
          const state = currentOffice.agentStates[agentId] || 'IDLE'
          const mat = statusMesh.material as THREE.MeshBasicMaterial

          if (state === 'VACANT') {
            mat.color.setHex(0x333333)
            statusMesh.visible = false
          } else {
            statusMesh.visible = true
            if (state === 'ANALYZING') {
              mat.color.setHex(0x38bdf8)
              const scale = 1 + Math.sin(elapsedTime * 6) * 0.35
              statusMesh.scale.set(scale, scale, scale)
            } else if (state === 'GENERATING') {
              mat.color.setHex(0xfacc15)
              const scale = 1 + Math.sin(elapsedTime * 9) * 0.4
              statusMesh.scale.set(scale, scale, scale)
            } else if (state === 'NEEDS_APPROVAL') {
              mat.color.setHex(0xf43f5e) // flashing alert red
              const scale = 1.3 + Math.sin(elapsedTime * 12) * 0.5
              statusMesh.scale.set(scale, scale, scale)
            } else if (state === 'DONE') {
              mat.color.setHex(0x34d399) // crisp green
              statusMesh.scale.set(1, 1, 1)
            } else if (state === 'ERROR' || state === 'WAITING_QUOTA') {
              mat.color.setHex(0xef4444)
              statusMesh.scale.set(1, 1, 1)
            } else {
              // IDLE
              mat.color.setHex(0x71717a)
              statusMesh.scale.set(0.8, 0.8, 0.8)
            }
          }
        })
      }

      // Animate 3D Handoff Packets
      if (threeRef.current && threeRef.current.handoffs.length > 0) {
        threeRef.current.handoffs = threeRef.current.handoffs.filter((handoff) => {
          handoff.progress += 0.025
          if (handoff.progress >= 1) {
            scene.remove(handoff.mesh)
            scene.remove(handoff.trailLine)
            handoff.mesh.geometry.dispose()
            handoff.trailLine.geometry.dispose()
            return false
          }

          // Parabolic arc interpolation: lerp + sin wave arc
          const currentPos = new THREE.Vector3().lerpVectors(handoff.sourcePos, handoff.targetPos, handoff.progress)
          currentPos.y += Math.sin(handoff.progress * Math.PI) * 2.8 // arc peak
          handoff.mesh.position.copy(currentPos)
          handoff.mesh.rotation.x += 0.1
          handoff.mesh.rotation.y += 0.15

          // Update trail line
          handoff.trailPoints.push(currentPos.clone())
          if (handoff.trailPoints.length > 18) handoff.trailPoints.shift()
          handoff.trailLine.geometry.setFromPoints(handoff.trailPoints)

          return true
        })
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      threeRef.current = null
    }
  }, []) // run once on mount

  // EventBus Subscriptions: Logs (Speech Bubbles) and Handoffs (3D Packets)
  useEffect(() => {
    // 1. Live Log Speech Bubble
    const unsubLog = eventBus.on('agent:log', (log) => {
      if (!threeRef.current) return
      const agentDef = AGENT_DEFINITIONS[log.agentId]
      if (!agentDef) return

      // Project agent 3D position to 2D screen coordinate
      const worldPos = new THREE.Vector3(...agentDef.deskPosition)
      worldPos.y += 2.0 // above head
      worldPos.project(threeRef.current.camera)

      const container = mountRef.current
      if (!container) return
      const halfW = container.clientWidth / 2
      const halfH = container.clientHeight / 2
      const screenX = worldPos.x * halfW + halfW
      const screenY = -(worldPos.y * halfH) + halfH

      const bubbleId = `bubble-${Date.now()}`
      setSpeechBubbles((prev) => [
        ...prev.filter((b) => b.agentId !== log.agentId), // replace previous bubble for this agent
        {
          id: bubbleId,
          agentId: log.agentId,
          text: log.message,
          screenX,
          screenY,
          visible: true,
        },
      ])

      // Auto-remove speech bubble after 4.5 seconds
      setTimeout(() => {
        setSpeechBubbles((prev) => prev.filter((b) => b.id !== bubbleId))
      }, 4500)

      // Sound blip
      playBlip(log.level === 'error' ? 320 : 640)

      // Auto-focus camera on speaking agent if enabled
      if (store.autoFocusActiveAgent && threeRef.current) {
        threeRef.current.targetCameraPos = new THREE.Vector3(
          agentDef.deskPosition[0],
          agentDef.deskPosition[1] + 4,
          agentDef.deskPosition[2] + 5.5
        )
        threeRef.current.targetControlsTarget = new THREE.Vector3(
          agentDef.deskPosition[0],
          agentDef.deskPosition[1] + 1.2,
          agentDef.deskPosition[2]
        )
      }
    })

    // 2. 3D Animated Handoff Packet
    const unsubHandoff = eventBus.on('agent:handoff', (data) => {
      if (!threeRef.current) return
      const sourceDef = AGENT_DEFINITIONS[data.sourceAgent]
      const targetDef = AGENT_DEFINITIONS[data.targetAgent]
      if (!sourceDef || !targetDef) return

      const sourcePos = new THREE.Vector3(...sourceDef.deskPosition)
      sourcePos.y = 0.9
      const targetPos = new THREE.Vector3(...targetDef.deskPosition)
      targetPos.y = 0.9

      // Glowing golden packet mesh (envelope/crystal)
      const packetGeo = new THREE.OctahedronGeometry(0.2, 0)
      const packetMat = new THREE.MeshStandardMaterial({
        color: 0xfaae33,
        emissive: 0xfaae33,
        emissiveIntensity: 1.2,
        roughness: 0.1,
      })
      const mesh = new THREE.Mesh(packetGeo, packetMat)
      mesh.position.copy(sourcePos)
      threeRef.current.scene.add(mesh)

      // Trail line
      const trailGeo = new THREE.BufferGeometry().setFromPoints([sourcePos.clone()])
      const trailMat = new THREE.LineBasicMaterial({
        color: 0xfaae33,
        transparent: true,
        opacity: 0.6,
      })
      const trailLine = new THREE.Line(trailGeo, trailMat)
      threeRef.current.scene.add(trailLine)

      threeRef.current.handoffs.push({
        sourcePos,
        targetPos,
        progress: 0,
        mesh,
        trailPoints: [sourcePos.clone()],
        trailLine,
      })

      playBlip(880, 'triangle')
    })

    return () => {
      unsubLog()
      unsubHandoff()
    }
  }, [playBlip, store.autoFocusActiveAgent])

  // Handle Office Lights & Power
  useEffect(() => {
    if (!threeRef.current) return
    const { lights, scene } = threeRef.current
    const { ambient, sun, neonFill } = lights

    if (officeLightsOn && activeOffice?.status === 'ON') {
      ambient.intensity = 0.65
      sun.intensity = 1.4
      neonFill.intensity = 1.2
      scene.background = new THREE.Color(0x12100e)
    } else {
      // Night / Power Off Mode: dim ambient & deep dark purple hue
      ambient.intensity = 0.18
      sun.intensity = 0.3
      neonFill.intensity = 0.4
      scene.background = new THREE.Color(0x0a0908)
    }
  }, [officeLightsOn, activeOffice?.status])

  // Handle Camera Presets via cameraZone
  useEffect(() => {
    if (!threeRef.current) return
    let targetPos: THREE.Vector3
    let targetLook: THREE.Vector3

    switch (cameraZone) {
      case 'dora':
        targetPos = new THREE.Vector3(0, 4.5, -0.5)
        targetLook = new THREE.Vector3(0, 1.2, -4.5)
        break
      case 'producto':
        targetPos = new THREE.Vector3(-5.5, 6.5, 6.5)
        targetLook = new THREE.Vector3(-5.5, 1.1, 0)
        break
      case 'marketing':
        targetPos = new THREE.Vector3(5.5, 5.5, 4.5)
        targetLook = new THREE.Vector3(5.5, 1.1, -1.5)
        break
      case 'ecommerce':
        targetPos = new THREE.Vector3(3.5, 5.5, 6.5)
        targetLook = new THREE.Vector3(3.5, 1.1, 1.8)
        break
      case 'operaciones':
        targetPos = new THREE.Vector3(0, 5.5, 9.5)
        targetLook = new THREE.Vector3(0, 1.1, 4.5)
        break
      case 'all':
      default:
        targetPos = new THREE.Vector3(0, 14, 18)
        targetLook = new THREE.Vector3(0, 1, 0)
        break
    }

    threeRef.current.targetCameraPos = targetPos
    threeRef.current.targetControlsTarget = targetLook
  }, [cameraZone])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '520px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #3d2a1d',
        backgroundColor: '#12100e',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      }}
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating 3D Speech Bubbles */}
      {speechBubbles.map((bubble) => {
        const agentDef = AGENT_DEFINITIONS[bubble.agentId]
        return (
          <div
            key={bubble.id}
            style={{
              position: 'absolute',
              left: `${bubble.screenX}px`,
              top: `${Math.max(20, bubble.screenY - 70)}px`,
              transform: 'translate(-50%, -100%)',
              maxWidth: '240px',
              backgroundColor: 'rgba(26, 20, 16, 0.94)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${agentDef.avatarColor}`,
              borderRadius: '8px',
              padding: '0.45rem 0.65rem',
              color: '#f3f4f6',
              fontSize: '0.75rem',
              lineHeight: 1.35,
              pointerEvents: 'none',
              zIndex: 30,
              boxShadow: `0 4px 18px rgba(0,0,0,0.6), 0 0 12px ${agentDef.avatarColor}40`,
              animation: 'fadeInUp 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: agentDef.avatarColor,
                  display: 'inline-block',
                }}
              />
              <strong style={{ color: agentDef.avatarColor, fontSize: '0.72rem' }}>{agentDef.name}</strong>
              <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>• {agentDef.department}</span>
            </div>
            <div style={{ wordBreak: 'break-word' }}>{bubble.text}</div>
          </div>
        )
      })}

      {/* Hover Tooltip when cursor over an agent */}
      {hoveredAgent && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(24, 18, 14, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #faae33',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            color: '#fff',
            fontSize: '0.78rem',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: AGENT_DEFINITIONS[hoveredAgent].avatarColor, fontWeight: 700 }}>
            {AGENT_DEFINITIONS[hoveredAgent].name}
          </span>
          <span style={{ opacity: 0.7 }}>— {AGENT_DEFINITIONS[hoveredAgent].role}</span>
          <span style={{ fontSize: '0.7rem', color: '#faae33' }}>[Clic para inspeccionar]</span>
        </div>
      )}

      {/* Floating Canvas Top Bar: Quick Zone Jump & Controls */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '0.35rem',
          flexWrap: 'wrap',
          zIndex: 35,
        }}
      >
        <button
          onClick={() => store.setCameraZone('all')}
          style={{
            background: cameraZone === 'all' ? '#faae33' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'all' ? '#181008' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'all' ? '#faae33' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Vista General
        </button>
        <button
          onClick={() => store.setCameraZone('dora')}
          style={{
            background: cameraZone === 'dora' ? '#faae33' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'dora' ? '#181008' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'dora' ? '#faae33' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Dirección
        </button>
        <button
          onClick={() => store.setCameraZone('producto')}
          style={{
            background: cameraZone === 'producto' ? '#38bdf8' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'producto' ? '#082f49' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'producto' ? '#38bdf8' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Producto
        </button>
        <button
          onClick={() => store.setCameraZone('marketing')}
          style={{
            background: cameraZone === 'marketing' ? '#e879f9' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'marketing' ? '#4a044e' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'marketing' ? '#e879f9' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Marketing
        </button>
        <button
          onClick={() => store.setCameraZone('ecommerce')}
          style={{
            background: cameraZone === 'ecommerce' ? '#2dd4bf' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'ecommerce' ? '#134e4a' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'ecommerce' ? '#2dd4bf' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Ecommerce
        </button>
        <button
          onClick={() => store.setCameraZone('operaciones')}
          style={{
            background: cameraZone === 'operaciones' ? '#facc15' : 'rgba(18, 18, 20, 0.85)',
            color: cameraZone === 'operaciones' ? '#422006' : '#f3f4f6',
            border: `1px solid ${cameraZone === 'operaciones' ? '#facc15' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tráfico y Ops
        </button>
      </div>

      {/* Floating Canvas Top Right: Camera Auto-Focus, Lights & Sound */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 35,
        }}
      >
        <button
          onClick={store.toggleAutoFocus}
          title={store.autoFocusActiveAgent ? 'Desactivar auto-enfoque' : 'Activar auto-enfoque al agente activo'}
          style={{
            background: store.autoFocusActiveAgent ? 'rgba(250, 174, 51, 0.25)' : 'rgba(18, 18, 20, 0.85)',
            color: store.autoFocusActiveAgent ? '#faae33' : '#a1a1aa',
            border: `1px solid ${store.autoFocusActiveAgent ? '#faae33' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Auto-Foco: {store.autoFocusActiveAgent ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={store.toggleOfficeLights}
          title="Encender o atenuar luces de la oficina 3D"
          style={{
            background: officeLightsOn ? 'rgba(250, 174, 51, 0.25)' : 'rgba(18, 18, 20, 0.85)',
            color: officeLightsOn ? '#faae33' : '#a1a1aa',
            border: `1px solid ${officeLightsOn ? '#faae33' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Luz: {officeLightsOn ? 'Día' : 'Noche'}
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title="Activar/desactivar efectos sonoros de la oficina"
          style={{
            background: soundEnabled ? 'rgba(250, 174, 51, 0.25)' : 'rgba(18, 18, 20, 0.85)',
            color: soundEnabled ? '#faae33' : '#a1a1aa',
            border: `1px solid ${soundEnabled ? '#faae33' : '#27272a'}`,
            borderRadius: '4px',
            padding: '0.3rem 0.55rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          Audio: {soundEnabled ? 'ON' : 'Mute'}
        </button>
      </div>

      {/* Floating Canvas Bottom Right: Legend of 3D Status Halos */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(20, 15, 12, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid #3d2a1d',
          borderRadius: '6px',
          padding: '0.35rem 0.65rem',
          display: 'flex',
          gap: '0.65rem',
          fontSize: '0.68rem',
          color: '#d4d4d8',
          zIndex: 35,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#71717a' }} /> Espera
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#38bdf8' }} /> Analizando
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#facc15' }} /> Generando
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f43f5e' }} /> Checkpoint
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#34d399' }} /> Finalizado
        </span>
      </div>
    </div>
  )
}
