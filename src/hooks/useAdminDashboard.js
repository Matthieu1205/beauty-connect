import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAdminDashboard() {
  const [loading,      setLoading]      = useState(true)
  const [kpis,         setKpis]         = useState({ salons: 0, clientes: 0, bookings: 0, pending: 0 })
  const [salons,       setSalons]       = useState([])
  const [pendingSalons,setPendingSalons] = useState([])
  const [clientes,     setClientes]     = useState([])
  const [bookings,     setBookings]     = useState([])
  const [communeStats, setCommuneStats] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)

    const [
      { data: allSalons },
      { data: allClientes },
      { data: recentBookings },
      { data: communeData },
    ] = await Promise.all([
      supabase.from('salons').select('*, profiles(nom, telephone)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*, bookings(count)').eq('role', 'cliente').order('created_at', { ascending: false }).limit(50),
      supabase.from('bookings')
        .select('*, salons(nom, commune), services(nom), profiles(nom)')
        .order('created_at', { ascending: false })
        .limit(60),
      supabase.from('salons').select('commune').eq('valide', true),
    ])

    const salonList    = allSalons ?? []
    const clienteList  = allClientes ?? []
    const bookingList  = recentBookings ?? []
    const communes     = communeData ?? []

    // KPIs
    const actifs  = salonList.filter((s) => s.valide)
    const pending = salonList.filter((s) => !s.valide)
    const monthBk = bookingList.filter((b) => b.created_at?.slice(0, 10) >= firstOfMonth)

    setKpis({
      salons:   actifs.length,
      clientes: clienteList.length,
      bookings: monthBk.length,
      pending:  pending.length,
    })

    setSalons(actifs)
    setPendingSalons(pending)
    setClientes(clienteList)
    setBookings(bookingList)

    // Stats par commune
    const stats = {}
    communes.forEach(({ commune }) => { stats[commune] = (stats[commune] ?? 0) + 1 })
    setCommuneStats(Object.entries(stats).sort((a, b) => b[1] - a[1]))

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function validerSalon(id) {
    await supabase.from('salons').update({ valide: true }).eq('id', id)
    load()
  }

  async function refuserSalon(id) {
    if (!window.confirm('Refuser et supprimer ce salon ? Cette action est irreversible.')) return
    await supabase.from('salons').delete().eq('id', id)
    load()
  }

  return { loading, kpis, salons, pendingSalons, clientes, bookings, communeStats, validerSalon, refuserSalon, reload: load }
}
