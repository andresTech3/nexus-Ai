import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { createProjectSchema, projectQuerySchema } from '@/lib/validation/projects.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * GET /api/v1/projects
 * Lista los proyectos de la organización activa con paginación, filtros y relación con clientes.
 * Rol requerido: 'employee' o 'admin'
 */
export const GET = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    querySchema: projectQuerySchema,
  },
  async ({ auth, query, requestId }) => {
    const supabase = await createClient()
    const { page, pageSize, status, search, clientId } = query

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let dbQuery = supabase
      .from('projects')
      .select('*, client:crm_clients(id, name, company_name, email)', {
        count: 'exact',
      })
      .eq('organization_id', auth.organizationId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }

    if (clientId) {
      dbQuery = dbQuery.eq('client_id', clientId)
    }

    if (search) {
      dbQuery = dbQuery.ilike('title', `%${search}%`)
    }

    const { data, count, error } = await dbQuery

    if (error) {
      console.error(`[Projects Fetch Error][${requestId}]`, error.message)
      return errorResponse('Error al consultar la lista de proyectos', 500, requestId)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
      requestId,
    })
  }
)

/**
 * POST /api/v1/projects
 * Crea un nuevo proyecto en la organización del usuario actual.
 * Rol requerido: 'employee' o 'admin'
 */
export const POST = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: createProjectSchema,
  },
  async ({ auth, body, requestId }) => {
    const supabase = await createClient()

    // Manejo de cliente: si viene clientId, usarlo. Si viene clientName sin clientId, buscar o crear cliente automáticamente.
    let resolvedClientId = body.clientId || null

    if (!resolvedClientId && body.clientName && body.clientName.trim()) {
      const clientName = body.clientName.trim()
      // Buscar cliente existente por nombre en la organización
      const { data: existingClient } = await supabase
        .from('crm_clients')
        .select('id')
        .eq('organization_id', auth.organizationId)
        .ilike('name', clientName)
        .maybeSingle()

      if (existingClient) {
        resolvedClientId = existingClient.id
      } else {
        // Crear cliente automático
        const { data: newClient } = await supabase
          .from('crm_clients')
          .insert({
            organization_id: auth.organizationId,
            name: clientName,
            company_name: clientName,
            email: `contacto@${clientName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'cliente'}.com`,
            status: 'active',
          })
          .select('id')
          .single()

        if (newClient) {
          resolvedClientId = newClient.id
        }
      }
    }

    const numericBudget = typeof body.budget === 'number' ? body.budget : parseFloat(String(body.budget).replace(/[^0-9.]/g, '')) || 0
    const budgetCents = Math.round(numericBudget * 100)

    const { data, error } = await supabase
      .from('projects')
      .insert({
        organization_id: auth.organizationId,
        client_id: resolvedClientId,
        title: body.title,
        description: body.description || null,
        status: body.status || 'planning',
        budget_cents: budgetCents,
        currency: body.currency || 'USD',
        start_date: body.startDate || null,
        due_date: body.dueDate || null,
      })
      .select('*, client:crm_clients(id, name, company_name, email)')
      .single()

    if (error) {
      console.error(`[Project Insert Error][${requestId}]`, error.message)
      return errorResponse('No se pudo crear el proyecto en la base de datos', 500, requestId)
    }

    return NextResponse.json(
      {
        data,
        message: 'Proyecto creado exitosamente',
        requestId,
      },
      { status: 201 }
    )
  }
)
