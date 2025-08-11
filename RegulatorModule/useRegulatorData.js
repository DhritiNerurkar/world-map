import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'regulatorDashboardData';

// The regions are now fixed and cannot be changed from the UI.
const initialData = {
  regions: [
    { id: 'usa', name: 'USA', coordinates: [-98.5795, 39.8283] },
    { id: 'emea', name: 'EMEA', coordinates: [24.0, 52.0] },
    { id: 'japan', name: 'Japan', coordinates: [138.2529, 36.2048] },
  ],
  regulators: {
    // The keys here match the region IDs from above.
    usa: [],
    emea: [],
    japan: [],
  },
};

export const useRegulatorData = () => {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure all fixed regions exist in the regulators object
        initialData.regions.forEach(region => {
          if (!parsed.regulators[region.id]) {
            parsed.regulators[region.id] = [];
          }
        });
        return { ...parsed, regions: initialData.regions }; // Always use the fixed regions
      }
      return initialData;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return initialData;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

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

  // Note: addRegion and deleteRegion have been removed.
  return { data, addRegulator, deleteRegulator, updateRegulatorPdf };
};