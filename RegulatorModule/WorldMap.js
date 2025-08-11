import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Box } from '@mui/material';

// Import the local JSON file. This bundles the map data into your app.
import geoData from './world-110m.json';

const WorldMap = ({ regions, onMarkerClick }) => {
  return (
    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#0D47A1' }}>
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Use the imported geoData variable here */}
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#002b4d" // Darker, more subtle continent color
                stroke="#0D47A1" // Ocean color
              />
            ))
          }
        </Geographies>
        {regions.map(({ id, name, coordinates }) => (
          <Marker key={id} coordinates={coordinates} onClick={() => onMarkerClick(id, name)}>
            <g
              fill="rgba(102, 204, 255, 0.7)" // Translucent glowing blue
              stroke="#FFF"
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => {
                e.currentTarget.style.fill = 'rgba(179, 229, 252, 1)';
                e.currentTarget.querySelector('circle').setAttribute('r', '6');
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.fill = 'rgba(102, 204, 255, 0.7)';
                e.currentTarget.querySelector('circle').setAttribute('r', '5');
              }}
            >
              <circle cx="12" cy="12" r="5" transform="translate(-12, -12)" />
            </g>
            <text
              textAnchor="middle"
              y={-15}
              style={{ fontFamily: 'Roboto, sans-serif', fill: '#FFF', fontSize: '14px', fontWeight: '500', pointerEvents: 'none' }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </Box>
  );
};

export default WorldMap;