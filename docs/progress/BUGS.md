# BUGS — NexusAI Platform

Registro de bugs conocidos y su estado.

---

## Estado: Ningún bug crítico abierto

*(Actualizar con cada iteración)*

### Formato de registro

```
## BUG-XXX — Descripción corta

**Severidad:** crítico | alto | medio | bajo  
**MVP:** MVP-00  
**Estado:** abierto | en investigación | resuelto | ignorado  
**Fecha reporte:** YYYY-MM-DD  
**Descripción:** ...  
**Reproducción:** ...  
**Causa raíz:** ...  
**Solución:** ...  
```

---

## BUG-001 — Credenciales Supabase no configuradas

**Severidad:** alto  
**MVP:** MVP-00  
**Estado:** abierto — bloqueante para integración  
**Fecha reporte:** 2026-10-17  
**Descripción:** El archivo `.env.local` contiene valores fake para Supabase. El cliente se creará pero fallará en cualquier llamada real.  
**Solución pendiente:** Configurar Supabase local con `supabase start` o conectar a proyecto cloud y actualizar `.env.local`.
