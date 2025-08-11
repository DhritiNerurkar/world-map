import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, Divider } from '@mui/material';
import { AddCircle, Delete, Close } from '@mui/icons-material';

const AdminPanel = ({ data, actions, onClose }) => {
  const [regionName, setRegionName] = useState('');
  const [regionCoords, setRegionCoords] = useState('');
  const [regulatorName, setRegulatorName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleAddRegion = () => {
    const coords = regionCoords.split(',').map(c => parseFloat(c.trim()));
    if (regionName && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      actions.addRegion(regionName, coords);
      setRegionName('');
      setRegionCoords('');
    } else {
      alert('Please enter a valid name and coordinates (e.g., "-98.5, 39.8").');
    }
  };

  const handleAddRegulator = () => {
    if (regulatorName && selectedRegion) {
      actions.addRegulator(selectedRegion, regulatorName);
      setRegulatorName('');
    } else {
      alert('Please select a region and enter a regulator name.');
    }
  };

  const handlePdfUpload = (e, regionId, regulatorId) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Reads file as a base64 string
      reader.onload = () => {
        actions.updateRegulatorPdf(regionId, regulatorId, reader.result);
        alert(`PDF uploaded for regulator!`);
      };
      reader.onerror = (error) => console.error('Error reading file:', error);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 3, m: 2, backgroundColor: 'rgba(26, 26, 26, 0.95)', color: 'white', border: '1px solid #42A5F5', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" gutterBottom>Admin Control Panel</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
      </Box>
      <Divider sx={{ my: 2, borderColor: '#555' }} />

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Add a New Region</Typography>
        <TextField label="Region Name" variant="outlined" size="small" value={regionName} onChange={e => setRegionName(e.target.value)} sx={{ mr: 1, mb: 1 }} />
        <TextField label="Coordinates (lon, lat)" variant="outlined" size="small" value={regionCoords} onChange={e => setRegionCoords(e.target.value)} sx={{ mr: 1, mb: 1 }}/>
        <Button variant="contained" onClick={handleAddRegion} startIcon={<AddCircle />}>Add Region</Button>
      </Box>
      <Divider sx={{ my: 2, borderColor: '#555' }} />

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Add a New Regulator</Typography>
        <TextField select SelectProps={{ native: true }} value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} label="Select Region" variant="outlined" size="small" sx={{ mr: 1, minWidth: 200, mb: 1 }}>
          <option value="">-- Select a Region --</option>
          {data.regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </TextField>
        <TextField label="Regulator Name" variant="outlined" size="small" value={regulatorName} onChange={e => setRegulatorName(e.target.value)} sx={{ mr: 1, mb: 1 }} />
        <Button variant="contained" onClick={handleAddRegulator} disabled={!selectedRegion || !regulatorName} startIcon={<AddCircle />}>Add Regulator</Button>
      </Box>
      <Divider sx={{ my: 2, borderColor: '#555' }} />

      <Typography variant="h6" sx={{ mb: 1 }}>Manage Existing Content</Typography>
      {data.regions.map(region => (
        <Box key={region.id} sx={{ mb: 2, p: 2, border: '1px solid #444', borderRadius: '8px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{region.name} 
            <IconButton size="small" onClick={() => window.confirm('Are you sure you want to delete this entire region and all its regulators?') && actions.deleteRegion(region.id)}><Delete sx={{color: '#ff7961'}}/></IconButton>
          </Typography>
          {data.regulators[region.id]?.map(regulator => (
            <Box key={regulator.id} display="flex" alignItems="center" sx={{ ml: 2, mt: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ flexGrow: 1, minWidth: '150px' }}>{regulator.name}</Typography>
              <Button variant="text" component="label" sx={{textTransform: 'none', color: regulator.pdfData ? '#81c784' : '#42A5F5'}}>
                {regulator.pdfData ? 'Change PDF' : 'Upload PDF'}
                <input type="file" hidden accept=".pdf" onChange={(e) => handlePdfUpload(e, region.id, regulator.id)} />
              </Button>
              <IconButton size="small" onClick={() => actions.deleteRegulator(region.id, regulator.id)}><Delete sx={{color: '#ff7961'}} /></IconButton>
            </Box>
          ))}
        </Box>
      ))}
    </Paper>
  );
};

export default AdminPanel;