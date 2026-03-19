import { useState } from 'react'
import { usePostulations } from '../hooks/usePostulations'
import PostulationForm from '../components/postulations/PostulationForm'
import PostulationTable from '../components/postulations/PostulationTable'

export default function SuiviPage() {
  const { postulations, loading, add, update, remove } = usePostulations()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('tous')

  const handleAdd = async (data) => {
    const { error } = await add(data)
    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      setShowForm(false)
    }
  }

  const filtered = postulations.filter(p => {
    if (filter === 'encours') return !p.refus
    if (filter === 'refus') return p.refus
    return true
  })

  const filters = [
    { key: 'tous', label: `Tous (${postulations.length})` },
    { key: 'encours', label: `En cours (${postulations.filter(p => !p.refus).length})` },
    { key: 'refus', label: `Refus (${postulations.filter(p => p.refus).length})` },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>Mes postulations 📝</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{postulations.length} candidature{postulations.length > 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
          ➕ Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              background: filter === f.key ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'white',
              color: filter === f.key ? 'white' : '#6b7280',
              boxShadow: filter === f.key ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.12)', border: '2px solid #ede9fe' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ Nouvelle postulation
          </h2>
          <PostulationForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6366f1', fontWeight: '600' }}>Chargement...</p>
        </div>
      ) : (
        <PostulationTable postulations={filtered} onUpdate={update} onDelete={remove} />
      )}
    </div>
  )
}