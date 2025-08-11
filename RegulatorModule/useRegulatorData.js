import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// The key used to save data in the browser's localStorage
const LOCAL_STORAGE_KEY = 'regulatorDashboardData';

// Initial default data for the first time the app loads
const initialData = {
  regions: [
    { id: '4f8d558a-5a44-4c75-8a62-d99f9a0b85a3', name: 'USA', coordinates: [-98.5795, 39.8283] },
    { id: '1b2a9d7c-8e47-4a89-9a2b-63f7d3d1e1c7', name: 'EMEA', coordinates: [24.0, 52.0] },
    { id: 'c9f8a7e6-3d1b-4b8e-9c7f-7a5d1f0e2b4d', name: 'Japan', coordinates: [138.2529, 36.2048] },
  ],
  regulators: {
    '4f8d558a-5a44-4c75-8a62-d99f9a0b85a3': [],
    '1b2a9d7c-8e47-4a89-9a2b-63f7d3d1e1c7': [],
    'c9f8a7e6-3d1b-4b8e-9c7f-7a5d1f0e2b4d': [],
  },
};

export const useRegulatorData = () => {
  const [data, setData] = useState(() => {
    // Load saved data from localStorage or use initialData
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : initialData;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return initialData;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // --- REGION MANAGEMENT ---
  const addRegion = (name, coordinates) => {
    const newRegion = { id: uuidv4(), name, coordinates };
    setData(prevData => ({
      ...prevData,
      regions: [...prevData.regions, newRegion],
      regulators: { ...prevData.regulators, [newRegion.id]: [] },
    }));
  };

  const deleteRegion = (regionId) => {
    setData(prevData => {
      const newData = { ...prevData };
      newData.regions = newData.regions.filter(r => r.id !== regionId);
      delete newData.regulators[regionId];
      return newData;
    });
  };

  // --- REGULATOR MANAGEMENT ---
  const addRegulator = (regionId, regulatorName) => {
    const newRegulator = { id: uuidv4(), name: regulatorName, pdfData: null };
    setData(prevData => ({
      ...prevData,
      regulators: {
        ...prevData.regulators,
        [regionId]: [...(prevData.regulators[regionId] || []), newRegulator],
      },
    }));
  };

  const deleteRegulator = (regionId, regulatorId) => {
    setData(prevData => ({
      ...prevData,
      regulators: {
        ...prevData.regulators,
        [regionId]: prevData.regulators[regionId].filter(reg => reg.id !== regulatorId),
      },
    }));
  };
  
  const updateRegulatorPdf = (regionId, regulatorId, pdfData) => {
    setData(prevData => {
      const newRegulators = { ...prevData.regulators };
      const regionRegulators = newRegulators[regionId].map(reg => {
        if (reg.id === regulatorId) {
          return { ...reg, pdfData };
        }
        return reg;
      });
      newRegulators[regionId] = regionRegulators;
      return { ...prevData, regulators: newRegulators };
    });
  };

  return { data, addRegion, deleteRegion, addRegulator, deleteRegulator, updateRegulatorPdf };
};