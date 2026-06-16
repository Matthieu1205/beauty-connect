import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSalons(filters = {}) {
  const [salons, setSalons]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      let q = supabase.from('salons').select('*').eq('valide', true)

      if (filters.commune && filters.commune !== 'Toutes')
        q = q.eq('commune', filters.commune)
      if (filters.type && filters.type !== 'Toutes')
        q = q.contains('types', [filters.type])
      if (filters.prixMax && filters.prixMax < 20000)
        q = q.lte('prix_min', filters.prixMax)
      if (filters.noteMin && filters.noteMin > 0)
        q = q.gte('note', filters.noteMin)
      if (filters.sort === 'prix')
        q = q.order('prix_min', { ascending: true })
      else
        q = q.order('note', { ascending: false })

      const { data, error } = await q
      if (!cancelled) {
        setSalons(data ?? [])
        setError(error)
        setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [filters.commune, filters.type, filters.prixMax, filters.noteMin, filters.sort])

  return { salons, loading, error }
}

export function useSalon(id) {
  const [salon,    setSalon]    = useState(null)
  const [services, setServices] = useState([])
  const [reviews,  setReviews]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetch() {
      const [{ data: s }, { data: sv }, { data: rv }] = await Promise.all([
        supabase.from('salons').select('*').eq('id', id).single(),
        supabase.from('services').select('*').eq('salon_id', id).eq('actif', true),
        supabase.from('reviews').select('*, profiles(nom)').eq('salon_id', id).order('created_at', { ascending: false }).limit(10),
      ])
      setSalon(s)
      setServices(sv ?? [])
      setReviews(rv ?? [])
      setLoading(false)
    }
    fetch()
  }, [id])

  return { salon, services, reviews, loading }
}
