import { usePostulations } from '../hooks/usePostulations'
import { differenceInDays, isAfter, isSameMonth, isSameYear } from 'date-fns'

const fmt = (date) => date ? new Date(date).toLocaleDateString('fr-CH') : '—'

function StatCard({ label, value, emoji, bg, shadow, small }) {
  return (
    <div style={{
      background: bg, borderRadius: small ? '16px' : '20px',
      padding: small ? '1rem 1.25rem' : '1.5rem',
      color: 'white', boxShadow: `0 8px 25px ${shadow}`,
    }}>
      <div style={{ fontSize: small ? '22px' : '28px', marginBottom: '6px' }}>{emoji}</div>
      <div style={{ fontSize: small ? '26px' : '36px', fontWeight: '800', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '12px', fontWeight: '500', opacity: 0.85, marginTop: '5px' }}>{label}</div>
    </div>
  )
}

function SectionCard({ title, emoji, children }) {
  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(99,102,241,0.08)' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e1b4b', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{emoji}</span> {title}
      </h2>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const { postulations, loading } = usePostulations()
  const today = new Date()

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: '#6366f1', fontWeight: '600' }}>Chargement...</p>
      </div>
    </div>
  )

  const total = postulations.length
  const encours = postulations.filter(p => !p.refus).length
  const refus = postulations.filter(p => p.refus).length
  const chomage = postulations.filter(p => !p.chomage).length
  const cemois = postulations.filter(p =>
    p.date_postulation &&
    isSameMonth(new Date(p.date_postulation), today) &&
    isSameYear(new Date(p.date_postulation), today)
  ).length

  const entretiensAVenir = postulations
    .filter(p => p.date_entretien_1 && isAfter(new Date(p.date_entretien_1), today) && !p.refus)
    .sort((a, b) => new Date(a.date_entretien_1) - new Date(b.date_entretien_1))

  const relancesJ15 = postulations
    .filter(p => p.date_postulation && differenceInDays(today, new Date(p.date_postulation)) >= 15 && !p.refus)
    .sort((a, b) => new Date(a.date_postulation) - new Date(b.date_postulation))

  const parEntreprise = Object.entries(
    postulations.reduce((acc, p) => {
      acc[p.institution] = acc[p.institution] || { total: 0, encours: 0 }
      acc[p.institution].total++
      if (!p.refus) acc[p.institution].encours++
      return acc
    }, {})
  ).sort((a, b) => a[0].localeCompare(b[0]))

  const parPoste = Object.entries(
    postulations.reduce((acc, p) => {
      const poste = p.infos_poste || 'Non précisé'
      acc[poste] = acc[poste] || { total: 0, encours: 0 }
      acc[poste].total++
      if (!p.refus) acc[poste].encours++
      return acc
    }, {})
  ).sort((a, b) => b[1].total - a[1].total)

  const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '13px' }
  const thStyle = { textAlign: 'left', color: '#9ca3af', fontWeight: '600', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }
  const tdStyle = { padding: '10px 0', borderBottom: '1px solid #f9fafb', color: '#374151' }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px' }}>Dashboard 📊</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Vue d'ensemble de vos candidatures</p>
      </div>

      {/* Stats principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Ce mois-ci" value={`${cemois} / 10`} emoji="📅"
          bg="linear-gradient(135deg, #ec4899, #f472b6)" shadow="rgba(236,72,153,0.4)" />
        <StatCard label="En cours" value={encours} emoji="🚀"
          bg="linear-gradient(135deg, #10b981, #34d399)" shadow="rgba(16,185,129,0.4)" />
        <StatCard label="Chômage non déclaré" value={chomage} emoji="⚠️"
          bg="linear-gradient(135deg, #f59e0b, #fbbf24)" shadow="rgba(245,158,11,0.4)" />
      </div>

      {/* Stats secondaires */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total postulations" value={total} emoji="📋" small
          bg="linear-gradient(135deg, #6366f1, #818cf8)" shadow="rgba(99,102,241,0.3)" />
        <StatCard label="Refus" value={refus} emoji="❌" small
          bg="linear-gradient(135deg, #ef4444, #f87171)" shadow="rgba(239,68,68,0.3)" />
      </div>

      {/* Entretiens & Relances */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SectionCard title="Entretiens à venir" emoji="🗓">
          {entretiensAVenir.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Aucun entretien planifié</p>
          ) : (
            <table style={tableStyle}>
              <thead><tr>
                <th style={thStyle}>Institution</th>
                <th style={thStyle}>Poste</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Date</th>
              </tr></thead>
              <tbody>
                {entretiensAVenir.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...tdStyle, fontWeight: '600', color: '#1e1b4b' }}>{p.institution}</td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>{p.infos_poste || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <span style={{ background: '#ede9fe', color: '#6366f1', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>{fmt(p.date_entretien_1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

        <SectionCard title="Relances J+15" emoji="🔔">
          {relancesJ15.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Aucune relance à faire</p>
          ) : (
            <table style={tableStyle}>
              <thead><tr>
                <th style={thStyle}>Institution</th>
                <th style={thStyle}>Poste</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Postulé le</th>
              </tr></thead>
              <tbody>
                {relancesJ15.map(p => (
                  <tr key={p.id}>
                    <td style={{ ...tdStyle, fontWeight: '600', color: '#1e1b4b' }}>{p.institution}</td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>{p.infos_poste || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>{fmt(p.date_postulation)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>

      {/* Par entreprise + par poste */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <SectionCard title="Postulations par institution" emoji="🏢">
          {parEntreprise.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Aucune donnée</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {parEntreprise.map(([name, s]) => (
                <div key={name} style={{ background: '#f8f7ff', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#1e1b4b', margin: '0 0 2px', fontSize: '13px' }}>{name}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>{s.total} candidature{s.total > 1 ? 's' : ''}</p>
                  </div>
                  <span style={{ background: s.encours > 0 ? '#d1fae5' : '#f3f4f6', color: s.encours > 0 ? '#059669' : '#9ca3af', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>
                    {s.encours} en cours
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Postulations par poste" emoji="💼">
          {parPoste.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '1rem 0' }}>Aucune donnée</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {parPoste.map(([poste, s]) => (
                <div key={poste} style={{ background: '#f0fdf4', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#1e1b4b', margin: '0 0 2px', fontSize: '13px' }}>{poste}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>{s.total} candidature{s.total > 1 ? 's' : ''}</p>
                  </div>
                  <span style={{ background: s.encours > 0 ? '#d1fae5' : '#f3f4f6', color: s.encours > 0 ? '#059669' : '#9ca3af', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: '700' }}>
                    {s.encours} en cours
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}