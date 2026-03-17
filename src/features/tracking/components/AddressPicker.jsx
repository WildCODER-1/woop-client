import { useState } from 'react'

export default function AddressPicker({ onSelect }) {
  const [address, setAddress] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const suggestions = [
    { icon: '🏠', name: 'Home', addr: '123 Main St, Austin, TX 78701' },
    { icon: '🏢', name: 'Work', addr: '456 Corporate Ave, Austin, TX 78704' },
    { icon: '🅿️', name: 'Parking', addr: '789 Lot Lane, Austin, TX 78702' },
  ]

  const handleSelect = (addr) => {
    setAddress(addr)
    onSelect?.(addr)
    setShowPicker(false)
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          background: 'white',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          color: address ? '#000' : '#999'
        }}
      >
        📍 {address || 'Tap to select location on map'}
      </button>

      {showPicker && (
        <div style={{
          marginTop: '8px',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '8px',
          background: '#f9f9f9'
        }}>
          {suggestions.map((s) => (
            <button
              key={s.addr}
              onClick={() => handleSelect(s.addr)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '4px',
                fontSize: '13px'
              }}
            >
              <div>{s.icon} {s.name}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                {s.addr}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}