import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, IconButton, Divider, Stack,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Delete, Close, Add, UploadFile } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AdminPanel = ({ data, actions, onClose }) => {
  const [newRegulatorName, setNewRegulatorName] = useState('');
  const [expandedRegion, setExpandedRegion] = useState(false);

  const handleAccordionChange = (regionId) => (event, isExpanded) => {
    setExpandedRegion(isExpanded ? regionId : false);
  };

  const handleAddRegulator = (regionId) => {
    if (newRegulatorName.trim()) {
      actions.addRegulator(regionId, newRegulatorName.trim());
      setNewRegulatorName(''); // Reset input field
    } else {
      alert('Please enter a name for the regulator.');
    }
  };

  const handlePdfUpload = (e, regionId, regulatorId) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => actions.updateRegulatorPdf(regionId, regulatorId, reader.result);
      reader.onerror = (error) => console.error('Error reading file:', error);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <Paper elevation={6} sx={{
      p: 3, m: 2, backgroundColor: 'rgba(26, 26, 26, 0.97)', color: 'white',
      border: '1px solid #42A5F5', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
      backdropFilter: 'blur(5px)'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" gutterBottom>Content Management</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
        Manage regulators and their documents for each region.
      </Typography>
      <Divider sx={{ my: 2, borderColor: '#555' }} />

      {data.regions.map(region => (
        <Accordion
          key={region.id}
          expanded={expandedRegion === region.id}
          onChange={handleAccordionChange(region.id)}
          sx={{ backgroundColor: '#333', color: 'white', mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h6">{region.name}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: '#222' }}>
            <Stack spacing={2}>
              {/* List existing regulators */}
              {data.regulators[region.id]?.length > 0 ? (
                data.regulators[region.id].map(regulator => (
                  <Paper key={regulator.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#424242' }}>
                    <Typography sx={{ flexGrow: 1 }}>{regulator.name}</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      startIcon={<UploadFile />}
                      sx={{ textTransform: 'none', color: regulator.pdfData ? '#81c784' : '#42A5F5', borderColor: regulator.pdfData ? '#81c784' : '#42A5F5' }}
                    >
                      {regulator.pdfData ? 'Change PDF' : 'Upload'}
                      <input type="file" hidden accept=".pdf" onChange={(e) => handlePdfUpload(e, region.id, regulator.id)} />
                    </Button>
                    <IconButton size="small" onClick={() => actions.deleteRegulator(region.id, regulator.id)}>
                      <Delete sx={{ color: '#ff7961' }} />
                    </IconButton>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', my: 2}}>
                  No regulators added for this region.
                </Typography>
              )}

              {/* Add new regulator form */}
              <Divider sx={{ borderColor: '#555' }} />
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAddRegulator(region.id); }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Add New Regulator to {region.name}</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Regulator Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={newRegulatorName}
                    onChange={e => setNewRegulatorName(e.target.value)}
                  />
                  <Button type="submit" variant="contained" startIcon={<Add />}>
                    Add
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default AdminPanel;