import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { Stack, TextField } from '@mui/material';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const UpdateModal = ({open, handleClose, item, updateItem}) =>{
  const [newName, setNewName] = useState(item);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

   useEffect(()=>{
    setNewName(item.name)
    setNewQuantity(item.quantity)
  },[item])

  const handleUpdate = () =>{
    updateItem(item.name, newName, newQuantity);
    handleClose();
  }

  return (
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default UpdateModal;
