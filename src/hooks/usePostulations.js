import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function usePostulations() {
  const [postulations, setPostulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('postulations')
      .select('*')
      .order('date_postulation', { ascending: false })

    if (error) setError(error.message)
    else setPostulations(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (postulation) => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('postulations')
        .insert([{ ...postulation, user_id: user.id }])
        .select()
        .single()

    if (!error) setPostulations(prev => [data, ...prev])
    return { error }
    }

  const update = async (id, updates) => {
    const { data, error } = await supabase
      .from('postulations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error) setPostulations(prev => prev.map(p => p.id === id ? data : p))
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase
      .from('postulations')
      .delete()
      .eq('id', id)

    if (!error) setPostulations(prev => prev.filter(p => p.id !== id))
    return { error }
  }

  return { postulations, loading, error, add, update, remove, refresh: fetch }
}