import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { createClientSchema, clientQuerySchema } from '@/lib/validation/crm.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * GET /api/v1/crm/clients
 * Lista clientes y leads de la organización activa con paginación y filtros.
 * Rol requerido: 'employee' o 'admin'
 */
export const GET = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    querySchema: clientQuerySchema,
  },
  async ({ auth, query, requestId }) => {
    const supabase = await createClient()
    const { page, pageSize, status, search } = query

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let dbQuery = supabase
      .from('crm_clients')
      .select('id, name, company_name, email, phone, status, custom_fields, created_at, updated_at', {
        count: 'exact',
      })
      .eq('organization_id', auth.organizationId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }

    if (search) {
      dbQuery = dbQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    const { data, count, error } = await dbQuery

    if (error) {
      console.error(`[CRM Fetch Error][${requestId}]`, error.message)
      return errorResponse('Error al consultar la lista de clientes', 500, requestId)
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
 * POST /api/v1/crm/clients
 * Registra un nuevo lead o cliente en la organización.
 * Rol requerido: 'employee' o 'admin'
 */
export const POST = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: createClientSchema,
  },
  async ({ auth, body, requestId }) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('crm_clients')
      .insert({
        organization_id: auth.organizationId,
        name: body.name,
        company_name: body.companyName || null,
        email: body.email,
        phone: body.phone || null,
        status: body.status,
        custom_fields: body.customFields || {},
      })
      .select('id, name, company_name, email, phone, status, custom_fields, created_at')
      .single()

    if (error) {
      console.error(`[CRM Insert Error][${requestId}]`, error.message)
      return errorResponse('No se pudo registrar el cliente', 500, requestId)
    }

    return NextResponse.json(
      {
        data,
        message: 'Cliente registrado exitosamente',
        requestId,
      },
      { status: 201 }
    )
  }
)
