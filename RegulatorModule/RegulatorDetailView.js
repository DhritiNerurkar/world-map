import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRegulatorData } from './useRegulatorData';

const RegulatorDetailView = () => {
  const { regulatorId } = useParams();
  const { data } = useRegulatorData();

  let regulator = null;

  // Find the regulator by its ID across all regions
  for (const regionId in data.regulators) {
    const found = data.regulators[regionId]?.find(r => r.id === regulatorId);
    if (found) {
      regulator = found;
      break;
    }
  }

  return (
    <Box sx={{ p: {xs: 1, sm: 2, md: 3}, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f7fa' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {regulator ? regulator.name : 'Regulator Details'}
        </Typography>
        <Button component={Link} to="/regulators" variant="contained" startIcon={<ArrowBack />}>
          Back to Map
        </Button>
      </Box>
      <Paper elevation={3} sx={{ flexGrow: 1, border: '1px solid #ccc' }}>
        {regulator && regulator.pdfData ? (
          <embed src={regulator.pdfData} type="application/pdf" width="100%" height="100%" />
        ) : (
          <Typography sx={{ p: 4 }}>Presentation could not be loaded or was not found for this regulator.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default RegulatorDetailView;