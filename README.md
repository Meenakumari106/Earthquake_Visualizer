1.“Earthquake Visualizer”

Created a real-time earthquake visualization web app that displays recent global earthquakes on an interactive world map.
Earthquakes happen constantly all around the world. Agencies like USGS (U.S. Geological Survey) publish real-time earthquake data via a public API.
Instead of just listing this data in tables, my app turns it into an interactive, color-coded world map, helping users visually understand:

Where earthquakes recently occurred

How strong they were (by marker size & color)

When they happened

How deep they were

It’s a data visualization + geospatial app — an excellent example of using APIs, React, and mapping libraries together.

2. How It Works — The Technical Flow

Let’s break down what’s happening step by step:

Step 1 — Fetch Earthquake Data

app (inside App.jsx) fetches data from the USGS Earthquake API:
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
This API returns data for all earthquakes that occurred in the past 24 hours, formatted in GeoJSON (a geographic JSON format).


Step 2 — Visualize on the Map

The fetched data (events) is passed into your <EarthquakeMap /> component.

Each earthquake becomes a circle marker drawn by React Leaflet — a React wrapper around the Leaflet.js mapping library.
Step 3 — Fit the Map to Earthquake Locations

my helper component <FitBounds /> automatically adjusts the map zoom/position to fit all the points.

map.fitBounds(latlngs, { padding: [40, 40] })
That way, the map always centers around the current earthquakes, whether they’re clustered in one area or spread globally.



Step 4 — Auto-Refresh (Optional)

In App.jsx, there’s a feature that can periodically re-fetch data (say every few minutes).
That keeps your visualization up to date in real time without refreshing the browser manually.

💡 3. Why It’s Useful
Use Case	Benefit
🌐 Educational / Research	Students or researchers can instantly see where quakes are happening.
🚨 Disaster Awareness	Emergency teams can monitor seismic activity visually.
📊 Data Visualization Demo	Great project for showcasing API integration + React + mapping.
🧑‍💻 Portfolio Project	Demonstrates frontend skills: API calls, state management, data visualization, and interactivity.

4. Tech Stack Summary
Part	Technology	Purpose
Frontend Framework	React (via Vite)	Handles UI and components
Map Library	React Leaflet	Displays map, markers, and popups
Data Source	USGS Earthquake API	Real-time earthquake data
Styling	Plain CSS (or Tailwind if added later)	Looks and layout
Deployment	Works locally and on platforms like Vercel.

Deployment link : https://earthquake-visualizer-fb4e.vercel.app/

RUN --
clone repo from github
npm create vite@latest earthquake-visualizer -- --template react
cd earthquake-visualizer
npm install react-leaflet leaflet dayjs
npm run dev

You’ll see output like:

  VITE v5.0.0  ready in 300ms

  ➜  Local:   http://localhost:5173/


