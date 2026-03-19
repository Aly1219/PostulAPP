import { useState } from 'react'
import { useEntreprises } from '../hooks/useEntreprises'
import { usePostulations } from '../hooks/usePostulations'

const inputStyle = {
  width: '100%', border: '2px solid #e5e7eb', borderRadius: '12px',
  padding: '10px 14px', fontSize: '14px', outline: 'none',
  fontFamily: 'inherit', background: 'white', transition: 'border-color 0.2s',
}
const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '700',
  color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
}
const focus = (e) => e.target.style.borderColor = '#6366f1'
const blur = (e) => e.target.style.borderColor = '#e5e7eb'

const EMPTY = { nom: '', site_web: '', adresse: '', contact_rh: '', notes: '', favori: false }

function EntrepriseForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Nom *</label>
          <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)}
            required placeholder="Nom de l'entreprise"
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={labelStyle}>Site web</label>
          <input type="text" value={form.site_web} onChange={e => set('site_web', e.target.value)}
            placeholder="https://..." style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={labelStyle}>Contact RH</label>
          <input type="text" value={form.contact_rh} onChange={e => set('contact_rh', e.target.value)}
            placeholder="Email ou nom" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Adresse</label>
          <input type="text" value={form.adresse} onChange={e => set('adresse', e.target.value)}
            placeholder="Ville, pays" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Notes générales</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            rows={3} placeholder="Informations, culture d'entreprise, impressions..."
            style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 18px', background: form.favori ? '#fef9c3' : '#f9fafb', borderRadius: '12px', border: `2px solid ${form.favori ? '#eab308' : '#e5e7eb'}`, transition: 'all 0.2s', width: 'fit-content' }}>
            <input type="checkbox" checked={form.favori} onChange={e => set('favori', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#eab308' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: form.favori ? '#a16207' : '#6b7280' }}>⭐ Entreprise favorite</span>
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
        <button type="button" onClick={onCancel}
          style={{ padding: '10px 20px', borderRadius: '12px', border: '2px solid #e5e7eb', background: 'white', fontSize: '14px', fontWeight: '600', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
          Annuler
        </button>
        <button type="submit"
          style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #ec4899)', fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
          {initial ? '💾 Enregistrer' : '➕ Ajouter'}
        </button>
      </div>
    </form>
  )
}

function EntrepriseCard({ entreprise, nbPostulations, onToggleFavori, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: 'white', borderRadius: '20px', padding: '1.25rem 1.5rem',
      boxShadow: '0 4px 20px rgba(99,102,241,0.06)',
      border: entreprise.favori ? '2px solid #fde68a' : '2px solid transparent',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

        {/* Infos */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '200px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
            background: entreprise.favori ? 'linear-gradient(135deg, #f59e0b, #eab308)' : 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          }}>
            {entreprise.favori ? '⭐' : '🏢'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b' }}>{entreprise.nom}</span>
              {entreprise.favori && (
                <span style={{ background: '#fef9c3', color: '#a16207', borderRadius: '8px', padding: '2px 10px', fontSize: '11px', fontWeight: '700' }}>⭐ Favorite</span>
              )}
              <span style={{ background: '#f0f4ff', color: '#6366f1', borderRadius: '8px', padding: '2px 10px', fontSize: '11px', fontWeight: '700' }}>
                {nbPostulations} postulation{nbPostulations > 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {entreprise.site_web && (
                <a href={entreprise.site_web} target="_blank" rel="noreferrer"
                  style={{ fontSize: '13px', color: '#6366f1', textDecoration: 'none', fontWeight: '500' }}>
                  🌐 {entreprise.site_web.replace('https://', '').replace('http://', '')}
                </a>
              )}
              {entreprise.adresse && <span style={{ fontSize: '13px', color: '#9ca3af' }}>📍 {entreprise.adresse}</span>}
              {entreprise.contact_rh && <span style={{ fontSize: '13px', color: '#9ca3af' }}>👤 {entreprise.contact_rh}</span>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={() => onToggleFavori(entreprise.id, entreprise.favori)}
            style={{ background: entreprise.favori ? '#fef9c3' : '#f9fafb', border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '16px', cursor: 'pointer' }}
            title={entreprise.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            {entreprise.favori ? '⭐' : '☆'}
          </button>
          {entreprise.notes && (
            <button onClick={() => setExpanded(!expanded)}
              style={{ background: '#f0f4ff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>
              📝 {expanded ? 'Masquer' : 'Notes'}
            </button>
          )}
          <button onClick={onEdit}
            style={{ background: '#f0f4ff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>
            ✏️
          </button>
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={async () => { await onDelete(entreprise.id); setConfirmDelete(false) }}
                style={{ background: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                Confirmer
              </button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              style={{ background: '#fef2f2', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Notes dépliables */}
      {expanded && entreprise.notes && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{entreprise.notes}</p>
        </div>
      )}
    </div>
  )
}

export default function EntreprisesPage() {
  const { entreprises, loading, add, update, remove, toggleFavori } = useEntreprises()
  const { postulations } = usePostulations()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('toutes')

  const getNbPostulations = (nom) =>
    postulations.filter(p => p.institution?.toLowerCase() === nom?.toLowerCase()).length

  const handleAdd = async (data) => {
    const { error } = await add(data)
    if (error) alert('Erreur : ' + error.message)
    else setShowForm(false)
  }

  const handleUpdate = async (data) => {
    const { error } = await update(editId, data)
    if (error) alert('Erreur : ' + error.message)
    else setEditId(null)
  }

  const filtered = entreprises.filter(e => {
    const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === 'favorites' ? e.favori : true
    return matchSearch && matchFiltre
  })

  const favorites = entreprises.filter(e => e.favori).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>Entreprises 🏢</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {entreprises.length} entreprise{entreprises.length > 1 ? 's' : ''} · {favorites} favorite{favorites > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '14px', padding: '12px 24px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
          ➕ Ajouter
        </button>
      </div>

      {/* Recherche + filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher une entreprise..."
          style={{ flex: 1, minWidth: '200px', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'white' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
        {['toutes', 'favorites'].map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
              background: filtre === f ? 'linear-gradient(135deg, #6366f1, #ec4899)' : 'white',
              color: filtre === f ? 'white' : '#6b7280',
              boxShadow: filtre === f ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}>
            {f === 'toutes' ? `Toutes (${entreprises.length})` : `⭐ Favorites (${favorites})`}
          </button>
        ))}
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.12)', border: '2px solid #ede9fe' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 1.25rem' }}>✨ Nouvelle entreprise</h2>
          <EntrepriseForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6366f1', fontWeight: '600' }}>Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏢</div>
          <p style={{ color: '#6b7280', fontWeight: '600' }}>Aucune entreprise trouvée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(e => (
            editId === e.id ? (
              <div key={e.id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.1)', border: '2px solid #ede9fe' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e1b4b', margin: '0 0 1rem' }}>✏️ Modifier {e.nom}</h3>
                <EntrepriseForm initial={e} onSubmit={handleUpdate} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <EntrepriseCard
                key={e.id}
                entreprise={e}
                nbPostulations={getNbPostulations(e.nom)}
                onToggleFavori={toggleFavori}
                onEdit={() => setEditId(e.id)}
                onDelete={remove}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}