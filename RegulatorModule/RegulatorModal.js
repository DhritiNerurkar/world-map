import React from 'react';
import { Modal, Box, Typography, Grid, Card, CardActionArea, CardContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: '#212121', // Darker background
  color: 'white',
  border: '1px solid #42A5F5',
  borderRadius: '12px',
  boxShadow: '0 8px 32px 0 rgba(66, 165, 245, 0.37)',
  p: 4,
};

const RegulatorModal = ({ open, handleClose, regionId, regionName, regulators }) => {
  const navigate = useNavigate();

  const handleRegulatorClick = (regulator) => {
    if (regulator.pdfData) {
      navigate(`/regulators/${regulator.id}`);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" component="h2" gutterBottom>
          {regionName} Regulators
        </Typography>
        <Grid container spacing={2}>
          {regulators && regulators.length > 0 ? (
            regulators.map((reg) => (
              <Grid item xs={12} sm={6} key={reg.id}>
                <Card sx={{ 
                  backgroundColor: reg.pdfData ? '#333' : '#555', 
                  color: 'white', 
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: reg.pdfData ? 'scale(1.03)' : 'none',
                  }
                }}>
                  <CardActionArea onClick={() => handleRegulatorClick(reg)} disabled={!reg.pdfData}>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {reg.name}
                      </Typography>
                      {!reg.pdfData && (
                        <Typography variant="caption" sx={{color: '#aaa'}}>
                          (Presentation not available)
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 2, color: '#ccc' }}>No regulators have been added for this region.</Typography>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default RegulatorModal;