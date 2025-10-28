import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function FitBounds({ events }) {
  const map = useMap()
  React.useEffect(() => {
    if (!events || events.length === 0) return
    const latlngs = events.map(e => [e.geometry.coordinates[1], e.geometry.coordinates[0]])
    try {
      map.fitBounds(latlngs, { padding: [40, 40] })
    } catch (err) {
      // ignore fit bounds errors for single point
    }
  }, [events, map])
  return null
}

function magToColor(m) {
  // scale magnitude to color (green -> red)
  if (m >= 6) return '#800026'
  if (m >= 5) return '#BD0026'
  if (m >= 4) return '#E31A1C'
  if (m >= 3) return '#FC4E2A'
  if (m >= 2) return '#FD8D3C'
  if (m >= 1) return '#FEB24C'
  return '#FED976'
}

export default function EarthquakeMap({ events = [] }) {
  const center = [20, 0]

  return (
    <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {events.map(ev => {
        const [lon, lat, depth] = ev.geometry.coordinates
        const mag = ev.properties.mag || 0
        const time = new Date(ev.properties.time)
        const radius = Math.max(4, mag * 4)
        const color = magToColor(mag)
        return (
          <CircleMarker
            key={ev.id}
            center={[lat, lon]}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{ev.properties.place}</h3>
                <p style={{ margin: 0 }}><strong>Magnitude:</strong> {mag}</p>
                <p style={{ margin: 0 }}><strong>Depth:</strong> {depth} km</p>
                <p style={{ margin: 0 }}><strong>Time:</strong> {time.toUTCString()}</p>
                <p style={{ marginTop: 8 }}>
                  <a href={ev.properties.url} target="_blank" rel="noreferrer">USGS details</a>
                </p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}

      <FitBounds events={events} />
    </MapContainer>
  )
}
