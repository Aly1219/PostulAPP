import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useNotes(postulationId) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!postulationId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('postulation_id', postulationId)
      .order('created_at', { ascending: false })

    if (!error) setNotes(data)
    setLoading(false)
  }, [postulationId])

  useEffect(() => { fetch() }, [fetch])

  const add = async (note) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('notes')
      .insert([{ ...note, postulation_id: postulationId, user_id: user.id }])
      .select()
      .single()

    if (!error) setNotes(prev => [data, ...prev])
    return { error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) setNotes(prev => prev.filter(n => n.id !== id))
    return { error }
  }

  return { notes, loading, add, remove }
}