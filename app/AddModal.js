import React from "react";
import { useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
} from "@mui/material";
import { collection, doc, setDoc } from "firebase/firestore"; 
import { firestore } from "@/firebase";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  gap: 3,
  display: "flex",
  flexDirection: "column",
};
const AddModal = ({ item, updatePantry }) => {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = useState(item || "");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item) 
    await setDoc(docRef, {})
    updatePantry()
  };

  
  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        ADD
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>

          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;
