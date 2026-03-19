import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useEntreprises() {
  const [entreprises, setEntreprises] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('entreprises')
      .select('*')
      .order('favori', { ascending: false })
      .order('nom', { ascending: true })
    if (!error) setEntreprises(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (entreprise) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('entreprises')
      .insert([{ ...entreprise, user_id: user.id }])
      .select()
      .single()
    if (!error) setEntreprises(prev => [data, ...prev])
    return { error }
  }

  const update = async (id, updates) => {
    const { data, error } = await supabase
      .from('entreprises')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setEntreprises(prev => prev.map(e => e.id === id ? data : e))
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from('entreprises').delete().eq('id', id)
    if (!error) setEntreprises(prev => prev.filter(e => e.id !== id))
    return { error }
  }

  const toggleFavori = async (id, current) => {
    return update(id, { favori: !current })
  }

  return { entreprises, loading, add, update, remove, toggleFavori }
}