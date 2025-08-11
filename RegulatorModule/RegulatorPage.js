import React, { useState } from 'react';
import { Box, Switch, FormControlLabel, Fade } from '@mui/material';
import WorldMap from './WorldMap';
import RegulatorModal from './RegulatorModal';
import AdminPanel from './AdminPanel';
import { useRegulatorData } from './useRegulatorData';

const RegulatorPage = () => {
  const { data, ...actions } = useRegulatorData();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({ id: null, name: '' });
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const handleMarkerClick = (regionId, regionName) => {
    // Prevent opening modal if admin panel is active
    if (!isAdminPanelOpen) {
      setSelectedRegion({ id: regionId, name: regionName });
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    // This container ensures the page fills the viewport height, minus your app's header
    <Box sx={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)' /* Adjust 64px to your header's actual height */ }}>
      
      {/* Admin Panel Toggle Switch */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1001 }}>
        <FormControlLabel
          control={<Switch checked={isAdminPanelOpen} onChange={(e) => setIsAdminPanelOpen(e.target.checked)} color="warning" />}
          label="Admin Mode"
          sx={{ 
            color: 'white', 
            textShadow: '1px 1px 2px black',
            backgroundColor: 'rgba(0,0,0,0.5)', 
            borderRadius: 1, 
            px: 1 
          }}
        />
      </Box>
      
      {/* Conditional Rendering: Show Admin Panel or Map */}
      <Fade in={isAdminPanelOpen} timeout={500}>
        <Box sx={{ display: isAdminPanelOpen ? 'block' : 'none', position: 'absolute', zIndex: 1000, width: '100%', height: '100%' }}>
          <AdminPanel data={data} actions={actions} onClose={() => setIsAdminPanelOpen(false)} />
        </Box>
      </Fade>

      <Fade in={!isAdminPanelOpen} timeout={500}>
        <Box sx={{ display: !isAdminPanelOpen ? 'block' : 'none', width: '100%', height: '100%' }}>
          <WorldMap regions={data.regions} onMarkerClick={handleMarkerClick} />
        </Box>
      </Fade>
      
      <RegulatorModal
        open={modalOpen}
        handleClose={handleCloseModal}
        regionId={selectedRegion.id}
        regionName={selectedRegion.name}
        regulators={data.regulators[selectedRegion.id]}
      />
    </Box>
  );
};

export default RegulatorPage;