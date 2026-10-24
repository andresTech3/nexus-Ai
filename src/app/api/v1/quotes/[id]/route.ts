import { NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createClient } from '@/lib/supabase/server'
import { updateQuoteStatusSchema } from '@/lib/validation/quotes.schemas'
import { errorResponse } from '@/lib/auth/server'

/**
 * PATCH /api/v1/quotes/[id]
 * Actualiza el estado de una cotización (aceptada, enviada, rechazada).
 */
export const PATCH = createApiHandler(
  {
    requireAuth: true,
    minRole: 'employee',
    bodySchema: updateQuoteStatusSchema,
  },
  async ({ auth, body, params, requestId }) => {
    const supabase = await createClient()
    const quoteId = params.id

    if (!quoteId) {
      return errorResponse('ID de cotización no especificado', 400, requestId)
    }

    const { data, error } = await supabase
      .from('quotes')
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quoteId)
      .eq('organization_id', auth.organizationId)
      .select('*, client:crm_clients(id, name, company_name), items:quote_items(*)')
      .single()

    if (error) {
      console.error(`[Quote Status Update Error][${requestId}]`, error.message)
      return errorResponse('No se pudo actualizar el estado de la cotización', 500, requestId)
    }

    return NextResponse.json({
      data,
      message: `Cotización actualizada a ${body.status}`,
      requestId,
    })
  }
)
