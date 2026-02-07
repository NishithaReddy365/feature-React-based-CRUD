import React, { useState, useEffect } from 'react'
import { User, FieldSchema } from '../types'

type Props = {
  schema: FieldSchema[]
  initial?: Partial<User>
  onSubmit: (data: User) => void
  onCancel?: () => void
}

export default function UserForm({ schema, initial = {}, onSubmit, onCancel }: Props) {
  const [data, setData] = useState<Record<string, any>>(() => {
    const base: Record<string, any> = {}
    schema.forEach(f => (base[f.name] = initial[f.name] ?? ''))
    // ensure countryCode exists for phone input
    base.countryCode = initial['countryCode'] ?? '+1'
    return base
  })
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  useEffect(() => {
    const base: Record<string, any> = {}
    schema.forEach(f => (base[f.name] = initial[f.name] ?? ''))
    base.countryCode = initial['countryCode'] ?? '+1'
    setData(base)
  }, [initial, schema])

  function validateField(f: FieldSchema, value: any) {
    if (f.required && !value) return `${f.label} is required`
    if (f.name === 'email' && value) {
      // require a gmail.com address specifically
      const ok = /^[^@\s]+@gmail\.com$/i.test(value)
      if (!ok) return 'Please enter a valid Gmail address (example@gmail.com)'
    }
    if (f.name === 'phone' && value) {
      const digits = String(value).replace(/\D/g, '')
      if (digits.length !== 10) return 'Enter the 10-digit local phone number (numbers only)'
      // ensure country code present
      if (!data.countryCode) return 'Select country code'
    }
    if (f.validate) return f.validate(value)
    return null
  }

  function validateAll() {
    const out: Record<string, string | null> = {}
    schema.forEach(f => {
      out[f.name] = validateField(f, data[f.name])
    })
    setErrors(out)
    return Object.values(out).every(v => v === null)
  }

  function handleChange(name: string, v: any) {
    setData(prev => ({ ...prev, [name]: v }))
  }

  const countryOptions = [
    { code: '+1', label: 'US +1' },
    { code: '+44', label: 'UK +44' },
    { code: '+91', label: 'IN +91' },
    { code: '+61', label: 'AU +61' },
    { code: '+81', label: 'JP +81' }
  ]

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!validateAll()) return
    const out = { ...(initial && (initial as any).id ? { id: (initial as any).id } : {}), ...data }
    onSubmit(out as User)
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'grid', gap: 12 }}>
        {schema.map(f => {
          if (f.name === 'phone') {
            return (
              <label key={f.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, marginBottom: 6 }}>{f.label}{f.required ? ' *' : ''}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select value={data.countryCode} onChange={e => handleChange('countryCode', e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}>
                    {countryOptions.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
                  </select>
                  <input
                    value={data[f.name] ?? ''}
                    onChange={e => handleChange(f.name, e.target.value)}
                    type={f.type ?? 'text'}
                    placeholder="1234567890"
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: 1 }}
                  />
                </div>
                {errors['countryCode'] && <span style={{ color: 'crimson', fontSize: 12 }}>{errors['countryCode']}</span>}
                {errors[f.name] && <span style={{ color: 'crimson', fontSize: 12 }}>{errors[f.name]}</span>}
              </label>
            )
          }
          return (
            <label key={f.name} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, marginBottom: 6 }}>{f.label}{f.required ? ' *' : ''}</span>
              <input
                value={data[f.name] ?? ''}
                onChange={e => handleChange(f.name, e.target.value)}
                type={f.type ?? 'text'}
                style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
              />
              {errors[f.name] && <span style={{ color: 'crimson', fontSize: 12 }}>{errors[f.name]}</span>}
            </label>
          )
        })}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ background: '#1976d2', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: 6 }}>Save</button>
          <button type="button" onClick={onCancel} style={{ padding: '8px 12px' }}>Cancel</button>
        </div>
      </div>
    </form>
  )
}
