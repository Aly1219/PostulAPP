import { useState, useEffect } from 'react'

const EMPTY_FORM = {
  institution: '', infos_societe: '', infos_poste: '',
  date_postulation: '', date_entree: '', date_relance: '',
  date_entretien_1: '', date_entretien_2: '',
  chomage: false, refus: false,
}

const inputStyle = {
  width: '100%', border: '2px solid #e5e7eb', borderRadius: '12px',
  padding: '10px 14px', fontSize: '14px', outline: 'none',
  fontFamily: 'inherit', background: 'white', transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: '700',
  color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
}

function Field({ label, children, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0', fontWeight: '500' }}>⚠️ {error}</p>}
    </div>
  )
}

export default function PostulationForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        date_postulation: initial.date_postulation?.slice(0, 10) || '',
        date_entree: initial.date_entree?.slice(0, 10) || '',
        date_relance: initial.date_relance?.slice(0, 10) || '',
        date_entretien_1: initial.date_entretien_1?.slice(0, 10) || '',
        date_entretien_2: initial.date_entretien_2?.slice(0, 10) || '',
      })
    } else {
      setForm({ ...EMPTY_FORM, date_postulation: new Date().toISOString().slice(0, 10) })
    }
  }, [initial])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    // Efface l'erreur quand on modifie le champ
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (form.date_entree && form.date_postulation && form.date_entree < form.date_postulation) {
      newErrors.date_entree = "La date d'entrée ne peut pas être antérieure à la date de postulation"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const cleaned = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]))
    onSubmit(cleaned)
  }

  const focus = (e) => e.target.style.borderColor = '#6366f1'
  const blur = (e) => e.target.style.borderColor = errors[e.target.name] ? '#ef4444' : '#e5e7eb'

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Institution *">
            <input type="text" value={form.institution} onChange={e => set('institution', e.target.value)}
              required placeholder="Nom de l'entreprise"
              style={inputStyle} onFocus={focus} onBlur={blur} />
          </Field>
        </div>

        <Field label="Infos société">
          <textarea value={form.infos_societe} onChange={e => set('infos_societe', e.target.value)}
            rows={2} placeholder="Secteur, taille, notes..."
            style={{ ...inputStyle, resize: 'none' }} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Infos poste">
          <textarea value={form.infos_poste} onChange={e => set('infos_poste', e.target.value)}
            rows={2} placeholder="Titre, missions, notes..."
            style={{ ...inputStyle, resize: 'none' }} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Date postulation">
          <input type="date" name="date_postulation" value={form.date_postulation}
            onChange={e => set('date_postulation', e.target.value)}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Entrée" error={errors.date_entree}>
          <input type="date" name="date_entree" value={form.date_entree}
            onChange={e => set('date_entree', e.target.value)}
            min={form.date_postulation || undefined}
            style={{ ...inputStyle, borderColor: errors.date_entree ? '#ef4444' : '#e5e7eb' }}
            onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Relance">
          <input type="date" name="date_relance" value={form.date_relance}
            onChange={e => set('date_relance', e.target.value)}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Entretien 1">
          <input type="date" name="date_entretien_1" value={form.date_entretien_1}
            onChange={e => set('date_entretien_1', e.target.value)}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Entretien 2">
          <input type="date" name="date_entretien_2" value={form.date_entretien_2}
            onChange={e => set('date_entretien_2', e.target.value)}
            style={inputStyle} onFocus={focus} onBlur={blur} />
        </Field>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 18px', background: form.chomage ? '#fef3c7' : '#f9fafb', borderRadius: '12px', border: `2px solid ${form.chomage ? '#f59e0b' : '#e5e7eb'}`, transition: 'all 0.2s' }}>
            <input type="checkbox" checked={form.chomage} onChange={e => set('chomage', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: form.chomage ? '#d97706' : '#6b7280' }}>⚠️ Chômage déclaré</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 18px', background: form.refus ? '#fef2f2' : '#f9fafb', borderRadius: '12px', border: `2px solid ${form.refus ? '#ef4444' : '#e5e7eb'}`, transition: 'all 0.2s' }}>
            <input type="checkbox" checked={form.refus} onChange={e => set('refus', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: form.refus ? '#ef4444' : '#6b7280' }}>❌ Refus</span>
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