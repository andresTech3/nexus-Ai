import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { createQuoteSchema, quoteQuerySchema } from '@/lib/validation/quotes.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * GET /api/v1/quotes
 * Lista las propuestas y cotizaciones de la organización activa con clientes e items.
 */
export const GET = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    querySchema: quoteQuerySchema,
  },
  async ({ auth, query, requestId }) => {
    const supabase = await createClient()
    const { page, pageSize, status, search } = query

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let dbQuery = supabase
      .from('quotes')
      .select('*, client:crm_clients(id, name, company_name, email), items:quote_items(*)', {
        count: 'exact',
      })
      .eq('organization_id', auth.organizationId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }

    if (search) {
      dbQuery = dbQuery.or(`quote_number.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    const { data, count, error } = await dbQuery

    if (error) {
      console.error(`[Quotes Fetch Error][${requestId}]`, error.message)
      return errorResponse('Error al consultar las cotizaciones', 500, requestId)
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
 * POST /api/v1/quotes
 * Emite una nueva cotización comercial con desglose de servicios.
 */
export const POST = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: createQuoteSchema,
  },
  async ({ auth, body, requestId }) => {
    const supabase = await createClient()

    // 1. Resolver cliente
    let clientId = body.clientId || null
    if (!clientId && body.clientName) {
      const clientName = body.clientName.trim()
      const { data: existingClient } = await supabase
        .from('crm_clients')
        .select('id')
        .eq('organization_id', auth.organizationId)
        .ilike('name', clientName)
        .maybeSingle()

      if (existingClient) {
        clientId = existingClient.id
      } else {
        const { data: newClient } = await supabase
          .from('crm_clients')
          .insert({
            organization_id: auth.organizationId,
            name: clientName,
            company_name: clientName,
            email: `contacto@${clientName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'empresa'}.com`,
            status: 'prospect',
          })
          .select('id')
          .single()

        if (newClient) clientId = newClient.id
      }
    }

    // 2. Generar número de cotización correlativo
    const { count } = await supabase
      .from('quotes')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', auth.organizationId)

    const quoteIndex = (count || 0) + 1
    const year = new Date().getFullYear()
    const quoteNumber = `COT-${year}-${String(quoteIndex).padStart(3, '0')}`

    // 3. Fechas y cálculos monetarios en enteros (céntimos)
    const totalCents = Math.round(Number(body.price) * 100)
    const validUntilDate = new Date()
    validUntilDate.setDate(validUntilDate.getDate() + (body.validDays || 15))
    const validUntilStr = validUntilDate.toISOString().split('T')[0]

    // 4. Insertar cabecera de cotización
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        organization_id: auth.organizationId,
        client_id: clientId,
        quote_number: quoteNumber,
        status: body.status || 'sent',
        currency: body.currency || 'USD',
        subtotal_cents: totalCents,
        tax_cents: 0,
        total_cents: totalCents,
        valid_until: validUntilStr,
        notes: body.notes || null,
      })
      .select('*, client:crm_clients(id, name, company_name, email)')
      .single()

    if (quoteError) {
      console.error(`[Quote Insert Error][${requestId}]`, quoteError.message)
      return errorResponse('Error al registrar la cotización en la base de datos', 500, requestId)
    }

    // 5. Insertar ítem de servicio en quote_items
    const { data: item } = await supabase
      .from('quote_items')
      .insert({
        quote_id: quote.id,
        description: body.serviceName,
        quantity: 1,
        unit_price_cents: totalCents,
        total_price_cents: totalCents,
      })
      .select('*')
      .single()

    return NextResponse.json(
      {
        data: {
          ...quote,
          items: item ? [item] : [],
        },
        message: 'Cotización creada y emitida exitosamente',
        requestId,
      },
      { status: 201 }
    )
  }
)
