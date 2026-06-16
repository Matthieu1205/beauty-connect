import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSalonDashboard(userId) {
  const [salon,    setSalon]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const [todayRdv,   setTodayRdv]   = useState([])
  const [monthStats, setMonthStats] = useState({ count: 0, revenue: 0, presence: 0 })
  const [services,   setServices]   = useState([])
  const [clients,    setClients]    = useState([])
  const [weekRdv,    setWeekRdv]    = useState([])

  const today          = new Date().toISOString().slice(0, 10)
  const firstOfMonth   = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    // 1. Salon du gérant
    const { data: s, error: sErr } = await supabase
      .from('salons')
      .select('*')
      .eq('owner_id', userId)
      .single()

    if (sErr || !s) { setError('Aucun salon lié à ce compte.'); setLoading(false); return }
    setSalon(s)

    const sid = s.id

    // Toutes les requêtes en parallèle
    const [
      { data: rdvToday },
      { data: rdvMonth },
      { data: svcs },
      { data: rdvWeek },
      { data: rdvClients },
    ] = await Promise.all([
      // RDV du jour avec profil cliente et service
      supabase.from('bookings')
        .select('*, profiles(nom, telephone), services(nom, duree)')
        .eq('salon_id', sid)
        .eq('date_rdv', today)
        .order('heure_rdv'),

      // RDV du mois pour KPIs
      supabase.from('bookings')
        .select('montant, statut')
        .eq('salon_id', sid)
        .gte('date_rdv', firstOfMonth)
        .neq('statut', 'annule'),

      // Services du salon
      supabase.from('services')
        .select('*')
        .eq('salon_id', sid)
        .eq('actif', true)
        .order('prix'),

      // RDV de la semaine (7 prochains jours)
      supabase.from('bookings')
        .select('*, services(nom, duree), profiles(nom, telephone)')
        .eq('salon_id', sid)
        .gte('date_rdv', today)
        .lte('date_rdv', new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10))
        .order('date_rdv').order('heure_rdv'),

      // Dernières clientes distinctes
      supabase.from('bookings')
        .select('client_id, services(nom), profiles(nom, telephone), created_at')
        .eq('salon_id', sid)
        .order('created_at', { ascending: false })
        .limit(50),
    ])

    setTodayRdv(rdvToday ?? [])
    setServices(svcs ?? [])
    setWeekRdv(rdvWeek ?? [])

    // KPIs mois
    const total     = rdvMonth ?? []
    const revenus   = total.reduce((acc, b) => acc + (b.montant ?? 0), 0)
    const termines  = total.filter((b) => b.statut === 'termine').length
    const presence  = total.length ? Math.round((termines / total.length) * 100) : 0
    setMonthStats({ count: total.length, revenue: revenus, presence })

    // Clientes uniques (dernière visite par cliente)
    const seen = new Map()
    ;(rdvClients ?? []).forEach((b) => {
      if (!seen.has(b.client_id)) seen.set(b.client_id, b)
    })
    const countByClient = {}
    ;(rdvClients ?? []).forEach((b) => {
      countByClient[b.client_id] = (countByClient[b.client_id] ?? 0) + 1
    })
    const uniqueClients = [...seen.values()].slice(0, 10).map((b) => ({
      ...b,
      total_rdv: countByClient[b.client_id] ?? 1,
    }))
    setClients(uniqueClients)

    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  return { salon, loading, error, todayRdv, monthStats, services, clients, weekRdv, reload: load }
}
