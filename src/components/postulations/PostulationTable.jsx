import { useState } from 'react'
import PostulationForm from './PostulationForm'
import NotesJournal from './NotesJournal'

const fmt = (date) => date ? new Date(date).toLocaleDateString('fr-CH') : null

function DateBadge({ label, date, color }) {
  if (!date) return null
  const colors = {
    violet: { bg: '#ede9fe', text: '#6366f1' },
    pink: { bg: '#fce7f3', text: '#ec4899' },
    cyan: { bg: '#cffafe', text: '#0891b2' },
    amber: { bg: '#fef3c7', text: '#d97706' },
    green: { bg: '#d1fae5', text: '#059669' },
  }
  const c = colors[color] || colors.violet
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ background: c.bg, color: c.text, borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>{fmt(date)}</span>
    </div>
  )
}

export default function PostulationTable({ postulations, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [openNotes, setOpenNotes] = useState(null)

  const handleUpdate = async (id, data) => {
    await onUpdate(id, data)
    setEditId(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {postulations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
          <p style={{ color: '#6b7280', fontWeight: '600' }}>Aucune postulation pour l'instant</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Cliquez sur "+ Ajouter" pour commencer</p>
        </div>
      )}

      {postulations.map((p, idx) => (
        <div key={p.id} style={{
          background: 'white', borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(99,102,241,0.06)',
          border: p.refus ? '2px solid #fecaca' : '2px solid transparent',
          opacity: p.refus ? 0.75 : 1,
          transition: 'all 0.2s',
          overflow: 'hidden',
        }}>
          {editId === p.id ? (
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e1b4b', margin: '0 0 1rem' }}>✏️ Modifier la postulation</h3>
              <PostulationForm initial={p} onSubmit={(data) => handleUpdate(p.id, data)} onCancel={() => setEditId(null)} />
            </div>
          ) : (
            <div style={{ padding: '1.25rem 1.5rem' }}>

              {/* Infos + Actions */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

                {/* Infos principales */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '200px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    🏢
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600' }}>#{idx + 1}</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b' }}>{p.institution}</span>
                      {p.refus && <span style={{ background: '#fef2f2', color: '#ef4444', borderRadius: '8px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>❌ Refus</span>}
                      {p.chomage && <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: '8px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>⚠️ Chômage</span>}
                    </div>
                    {p.infos_societe && <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#6b7280' }}>{p.infos_societe}</p>}
                    {p.infos_poste && <p style={{ margin: 0, fontSize: '13px', color: '#6366f1', fontWeight: '600', fontStyle: 'italic' }}>{p.infos_poste}</p>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button onClick={() => setOpenNotes(openNotes === p.id ? null : p.id)}
                    style={{ background: openNotes === p.id ? '#ede9fe' : '#f8f7ff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>
                    📓 Notes
                  </button>
                  <button onClick={() => setEditId(p.id)}
                    style={{ background: '#f0f4ff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6366f1', cursor: 'pointer', fontFamily: 'inherit' }}>
                    ✏️ Modifier
                  </button>
                  {confirmDelete === p.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={async () => { await onDelete(p.id); setConfirmDelete(null) }}
                        style={{ background: '#ef4444', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Confirmer
                      </button>
                      <button onClick={() => setConfirmDelete(null)}
                        style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(p.id)}
                      style={{ background: '#fef2f2', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Dates */}
              {(p.date_postulation || p.date_entree || p.date_relance || p.date_entretien_1 || p.date_entretien_2) && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <DateBadge label="Postulation" date={p.date_postulation} color="violet" />
                  <DateBadge label="Entrée" date={p.date_entree} color="cyan" />
                  <DateBadge label="Relance" date={p.date_relance} color="amber" />
                  <DateBadge label="Entretien 1" date={p.date_entretien_1} color="pink" />
                  <DateBadge label="Entretien 2" date={p.date_entretien_2} color="green" />
                </div>
              )}

              {/* Journal de notes (affiché si bouton cliqué) */}
              {openNotes === p.id && (
                <NotesJournal postulationId={p.id} institutionName={p.institution} />
              )}

            </div>
          )}
        </div>
      ))}
    </div>
  )
}