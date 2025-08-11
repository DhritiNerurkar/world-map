import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Box, keyframes } from '@mui/material';
import geoData from './world-110m.json';

// Create a pulsing animation for the markers
const pulseAnimation = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(102, 204, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(102, 204, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(102, 204, 255, 0); }
`;

const WorldMap = ({ regions, onMarkerClick }) => {
  return (
    // Add a radial gradient for a futuristic "vignette" effect
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      background: 'radial-gradient(circle, #004e92 0%, #000428 100%)' 
    }}>
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#002b4d" // Dark, desaturated continent color
                stroke="#0D47A1"
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#0069c0', outline: 'none', cursor: 'pointer' }, // Light up continents on hover
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {regions.map(({ id, name, coordinates }) => (
          <Marker key={id} coordinates={coordinates} onClick={() => onMarkerClick(id, name)}>
            {/* Pulsing glow effect */}
            <circle 
              r={8} 
              fill="rgba(102, 204, 255, 0.9)" 
              stroke="#fff" 
              strokeWidth={2}
              style={{ 
                cursor: 'pointer',
                animation: `${pulseAnimation} 2s infinite`
              }}
            />
            <text
              textAnchor="middle"
              y={-15}
              style={{ fontFamily: 'Roboto, sans-serif', fill: '#FFF', fontSize: '14px', fontWeight: 'bold', pointerEvents: 'none' }}
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