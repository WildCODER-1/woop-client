import { useState } from 'react'

export default function TrackingMap({ customerLocation, washerLocation }) {
  return (
    <div style={{
      width: '100%',
      height: '200px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '12px',
      color: '#666',
      fontSize: '14px',
      border: '2px solid #ddd'
    }}>
      <div style={{ fontSize: '24px' }}>🗺️</div>
      <div>Live tracking map</div>
      <div style={{ fontSize: '12px', opacity: 0.7 }}>
        📍 {customerLocation.lat.toFixed(4)}, {customerLocation.lng.toFixed(4)}
      </div>
    </div>
  )
}