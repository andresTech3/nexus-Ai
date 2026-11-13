const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'agents');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const agents = [
  { id: 'ivan', name: 'Iván', role: 'Cazador de Tendencias', color: '#f59e0b', icon: '🔍', bg1: '#78350f', bg2: '#f59e0b' },
  { id: 'valeria', name: 'Valeria', role: 'Especialista de Nicho', color: '#10b981', icon: '🎯', bg1: '#064e3b', bg2: '#10b981' },
  { id: 'clara', name: 'Clara', role: 'Espía de Competencia', color: '#8b5cf6', icon: '🕵️', bg1: '#4c1d95', bg2: '#8b5cf6' },
  { id: 'diego', name: 'Diego', role: 'Analista de Fábricas', color: '#3b82f6', icon: '📦', bg1: '#1e3a8a', bg2: '#3b82f6' },
  { id: 'eva', name: 'Eva', role: 'CFO de Rentabilidad', color: '#ec4899', icon: '💎', bg1: '#831843', bg2: '#ec4899' },
  { id: 'lucas', name: 'Lucas', role: 'Copywriter Persuasivo', color: '#06b6d4', icon: '✍️', bg1: '#164e63', bg2: '#06b6d4' },
  { id: 'leo', name: 'Leo', role: 'Director Creativo 3D', color: '#f97316', icon: '🎬', bg1: '#7c2d12', bg2: '#f97316' },
  { id: 'sofia', name: 'Sofía', role: 'Arquitecta de Tienda', color: '#14b8a6', icon: '🛍️', bg1: '#134e4a', bg2: '#14b8a6' },
  { id: 'tomas', name: 'Tomás', role: 'Media Buyer de Anuncios', color: '#6366f1', icon: '🚀', bg1: '#312e81', bg2: '#6366f1' },
  { id: 'mateo', name: 'Mateo', role: 'Especialista Viral TikTok', color: '#f43f5e', icon: '🔥', bg1: '#881337', bg2: '#f43f5e' },
  { id: 'dora', name: 'Dora', role: 'Directora de Calidad', color: '#eab308', icon: '🛡️', bg1: '#713f12', bg2: '#eab308' },
];

agents.forEach(a => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bg-${a.id}" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${a.bg2}" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="${a.bg1}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#09080e" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="ring-${a.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a.color}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="glow-${a.id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="200" cy="200" r="180" fill="url(#bg-${a.id})" stroke="${a.color}" stroke-width="4" stroke-opacity="0.6"/>
  <circle cx="200" cy="200" r="165" fill="none" stroke="${a.color}" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.4"/>
  <g filter="url(#glow-${a.id})">
    <circle cx="200" cy="175" r="82" fill="#14121d" stroke="url(#ring-${a.id})" stroke-width="3"/>
    <text x="200" y="206" font-size="76" text-anchor="middle" dominant-baseline="middle">${a.icon}</text>
  </g>
  <rect x="70" y="295" width="260" height="52" rx="26" fill="#110f18" stroke="${a.color}" stroke-width="2" stroke-opacity="0.8"/>
  <text x="200" y="327" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${a.name}</text>
</svg>`;
  fs.writeFileSync(path.join(dir, `${a.id}.svg`), svg);
});

console.log('Successfully generated 11 agent SVGs in public/agents/');

