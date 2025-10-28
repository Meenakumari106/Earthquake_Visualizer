import React, { useEffect, useState, useCallback, useRef } from 'react'
import EarthquakeMap from './components/EarthquakeMap'
import dayjs from 'dayjs'

const USGS_FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [minMag, setMinMag] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const intervalRef = useRef(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(USGS_FEED)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, 60000) // 60s
      return () => clearInterval(intervalRef.current)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoRefresh, fetchData])

  const events = (data && data.features) ? data.features.filter(f => (f.properties && f.properties.mag >= minMag)) : []

  return (
    <div className="app-root">
      <header className="topbar">
        <h1>Earthquake Visualizer</h1>
        <div className="meta">Last update: {data ? dayjs(data.metadata.generated).format('YYYY-MM-DD HH:mm:ss') : '—'}</div>
      </header>

      <main className="main">
        <aside className="controls">
          <div className="control-group">
            <label>Minimum magnitude: <strong>{minMag}</strong></label>
            <input type="range" min="0" max="8" step="0.1" value={minMag} onChange={e => setMinMag(parseFloat(e.target.value))} />
          </div>

          <div className="control-group">
            <button onClick={fetchData} disabled={loading}>Refresh</button>
            <label className="auto-refresh">
              <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} /> Auto-refresh (60s)
            </label>
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
  <strong>Color Guide:</strong>  
  <br />🟡 <span style={{ color: '#FEB24C' }}></span> : Minor activity (Low danger)
  <br />🟠 <span style={{ color: '#FC4E2A' }}></span> : Moderate activity (Noticeable tremors)
  <br />🔴 <span style={{ color: '#E31A1C' }}></span> : Strong earthquake (High danger)
  <br />🩸 <span style={{ color: '#800026' }}></span> : Severe earthquake (Very high danger)
</div>
 

          <div className="control-group">
            <p>Showing <strong>{events.length}</strong> events (filtered).</p>
            {error && <p className="error">Error: {error}</p>}
            {loading && <p>Loading…</p>}
          </div>

          

          <footer className="credits">
            Data from <a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer">USGS</a>
          </footer>
        </aside>

        <section className="map-area">
          <EarthquakeMap events={events} />
          
        </section>
        
      </main>
    </div>
  )
}
