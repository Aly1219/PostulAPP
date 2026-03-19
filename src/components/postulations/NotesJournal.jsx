import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNotes } from '../../hooks/useNotes'

const CATEGORIES = [
  { key: 'entretien', label: 'Entretien', emoji: '🗣', bg: '#ede9fe', color: '#6366f1' },
  { key: 'relance', label: 'Relance', emoji: '🔔', bg: '#fef3c7', color: '#d97706' },
  { key: 'contact', label: 'Contact', emoji: '📞', bg: '#cffafe', color: '#0891b2' },
  { key: 'document', label: 'Document', emoji: '📄', bg: '#d1fae5', color: '#059669' },
  { key: 'autre', label: 'Autre', emoji: '💬', bg: '#f3f4f6', color: '#6b7280' },
]

const getCat = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[4]

const fmtDate = (date) => new Date(date).toLocaleDateString('fr-CH', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

const inputStyle = {
  width: '100%', border: '2px solid #e5e7eb', borderRadius: '10px',
  padding: '8px 12px', fontSize: '13px', outline: 'none',
  fontFamily: 'inherit', background: 'white', transition: 'border-color 0.2s',
}

const mdStyles = {
  fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0,
}

export default function NotesJournal({ postulationId }) {
  const { notes, loading, add, remove } = useNotes(postulationId)
  const [showForm, setShowForm] = useState(false)
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('autre')
  const [preview, setPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await add({ titre, contenu, categorie })
    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      setTitre('')
      setContenu('')
      setCategorie('autre')
      setPreview(false)
      setShowForm(false)
    }
    setSaving(false)
  }

  return (
    <div style={{ marginTop: '1rem', borderTop: '2px solid #f0f4ff', paddingTop: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>
          📓 Journal ({notes.length})
        </span>
        <button onClick={() => { setShowForm(!showForm); setPreview(false) }}
          style={{ background: showForm ? '#fef2f2' : '#f0f4ff', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: '700', color: showForm ? '#ef4444' : '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>
          {showForm ? '✕ Annuler' : '+ Note'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleAdd} style={{ background: '#f8f7ff', borderRadius: '14px', padding: '1rem', marginBottom: '1rem', border: '2px solid #ede9fe' }}>

          {/* Catégories */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {CATEGORIES.map(c => (
              <button type="button" key={c.key} onClick={() => setCategorie(c.key)}
                style={{ background: categorie === c.key ? c.bg : 'white', border: `2px solid ${categorie === c.key ? c.color : '#e5e7eb'}`, borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: categorie === c.key ? c.color : '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Titre */}
          <input type="text" value={titre} onChange={e => setTitre(e.target.value)}
            required placeholder="Titre de la note"
            style={{ ...inputStyle, marginBottom: '8px' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'} />

          {/* Tabs Écrire / Aperçu */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button type="button" onClick={() => setPreview(false)}
              style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: !preview ? '#6366f1' : '#f3f4f6', color: !preview ? 'white' : '#6b7280' }}>
              ✏️ Écrire
            </button>
            <button type="button" onClick={() => setPreview(true)}
              style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', background: preview ? '#6366f1' : '#f3f4f6', color: preview ? 'white' : '#6b7280' }}>
              👁 Aperçu
            </button>
            <span style={{ fontSize: '11px', color: '#9ca3af', alignSelf: 'center', marginLeft: '4px' }}>Markdown supporté</span>
          </div>

          {/* Éditeur ou aperçu */}
          {preview ? (
            <div style={{ ...inputStyle, minHeight: '80px', padding: '10px 14px', background: 'white', marginBottom: '10px' }}>
              {contenu ? (
                <div style={mdStyles}>
                  <ReactMarkdown>{contenu}</ReactMarkdown>
                </div>
              ) : (
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>Rien à afficher...</span>
              )}
            </div>
          ) : (
            <textarea value={contenu} onChange={e => setContenu(e.target.value)}
              rows={4} placeholder={'# Titre\n## Sous-titre\n**gras**, *italique*, - liste'}
              style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px', fontFamily: 'monospace' }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving}
              style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: '700', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {/* Liste des notes */}
      {loading ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', padding: '1rem 0' }}>Chargement...</p>
      ) : notes.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', padding: '1rem 0' }}>Aucune note pour l'instant</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notes.map(note => {
            const cat = getCat(note.categorie)
            return (
              <div key={note.id} style={{ background: 'white', borderRadius: '12px', padding: '12px 14px', border: '1px solid #f3f4f6', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {cat.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e1b4b' }}>{note.titre}</span>
                      <span style={{ background: cat.bg, color: cat.color, borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>{cat.label}</span>
                    </div>
                    {confirmDelete === note.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={async () => { await remove(note.id); setConfirmDelete(null) }}
                          style={{ background: '#ef4444', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: '700', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Supprimer
                        </button>
                        <button onClick={() => setConfirmDelete(null)}
                          style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(note.id)}
                        style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#d1d5db', padding: '2px' }}>
                        🗑️
                      </button>
                    )}
                  </div>

                  {/* Contenu en Markdown */}
                  {note.contenu && (
                    <div style={{ ...mdStyles, borderTop: '1px solid #f9fafb', paddingTop: '6px' }}>
                      <style>{`
                        .md-note h1 { font-size: 15px; font-weight: 700; color: #1e1b4b; margin: 8px 0 4px; }
                        .md-note h2 { font-size: 14px; font-weight: 700; color: #374151; margin: 6px 0 3px; }
                        .md-note h3 { font-size: 13px; font-weight: 700; color: #6b7280; margin: 4px 0 2px; }
                        .md-note p { margin: 0 0 6px; }
                        .md-note ul, .md-note ol { margin: 4px 0; padding-left: 18px; }
                        .md-note li { margin: 2px 0; }
                        .md-note strong { font-weight: 700; color: #1e1b4b; }
                        .md-note em { font-style: italic; color: #6366f1; }
                        .md-note code { background: #f0f4ff; color: #6366f1; padding: 1px 6px; border-radius: 4px; font-size: 12px; font-family: monospace; }
                        .md-note blockquote { border-left: 3px solid #6366f1; margin: 6px 0; padding: 4px 10px; background: #f8f7ff; border-radius: 0 8px 8px 0; color: #6b7280; }
                        .md-note hr { border: none; border-top: 1px solid #e5e7eb; margin: 8px 0; }
                      `}</style>
                      <div className="md-note">
                        <ReactMarkdown>{note.contenu}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '6px 0 0' }}>{fmtDate(note.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}