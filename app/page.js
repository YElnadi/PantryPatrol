"use client";
import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
  
} from "firebase/firestore";
import { useEffect, useState } from "react";
import UpdateModal from "./UpdateModal";
// import AddModal from "./AddModal";
// import UpdateModal from "./UpdateModal";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");

  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    console.log("inventorylist###", inventoryList);
    setInventory(inventoryList);
  };

  //will run only once when page upload
  useEffect(() => {
    console.log("in use effect");
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //remove item from Inventory
  const deleteItem = async (itemName) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);

    // Check if the document exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // Delete the document regardless of quantity
      await deleteDoc(docRef);
    }

    // Update the inventory after deletion
    await updateInventory();
  };

  //Add Item
  const addItem = async (itemName, itemQuantity) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    // console.log(`in delete; itemName: "${itemName}" docRef: ${docRef}`)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + itemQuantity });
    } else {
      await setDoc(docRef, { quantity: itemQuantity });
    }
    await updateInventory();
  };

  const handleAddItem = async () => {
    setErrorMessage("");

    if (!itemName.trim() || itemQuantity <= 0) {
      setErrorMessage("Please enter a valid name and quantity.");
      return;
    }
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setErrorMessage("Name already exists. Please choose a different name.");
    } else {
      await addItem(itemName, itemQuantity);
      setItemName("");
      setItemQuantity("");
      handleClose();
    }
  };

  const handleCloseModal = () => {
    if (!itemName.trim() || itemQuantity <= 0) {
      setErrorMessage("Please enter a valid name and quantity.");
      return;
    }
    handleClose();
  };
  //update data
  const updateItem = async (itemName, newName, newQuantity) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    await setDoc(
      docRef,
      { name: newName, quantity: newQuantity },
      { merge: true }
    );
    await updateInventory();
  };

  //filter inventory
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
      bgcolor={"yellow"}
      overflow={"hidden"}
    >
      {/* <UpdateModal
      open={open}
      handleClose={handleClose}
      item={currentItem}
      updateItem={updateItem}
      /> */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={600}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              required
              unique
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setErrorMessage("");
              }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              required
              type="number"
              value={itemQuantity}
              onChange={(e) => {
                setItemQuantity(Number(e.target.value));
                setErrorMessage("");
              }}
            />
            <Button variant="outlined" DeleteIcon onClick={handleAddItem}>
              Add
            </Button>
          </Stack>
          {errorMessage && (
            <Typography variant="body2" color="red">
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </Stack>

      <Box>
        <Box
          width="1000px"
          height="100px"
          bgcolor="#ADD8E6"
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="1000px"
          height="500px"
          spacing={2}
          sx={{
            overflow: "hidden", // Hide scrollbars initially
            "&:hover": {
              overflowY: "auto", // Show vertical scrollbar on hover
            },
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "10px",
            },
            "&:hover::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              height="50px"
              // minHeight="150px"
              display="flex"
              // alignItems="center"
              justifyContent="space-between"
              bgcolor="pink"
              padding={2}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                padding={2}
              >
                <Grid xs={6}>
                  <Typography variant="h3" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="h3" color="#333">
                    {quantity}
                  </Typography>
                </Grid>
              </Grid>
              <Box display={"flex"} justifyContent={"space-around"} p={2}>
                <IconButton
                  onClick={() => {
                    setCurrentItem({ name, quantity });
                    handleOpen();
                  }}
                >
                  <EditIcon sx={{ fontSize: 40, color: "blue" }} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    deleteItem(name);
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 40, color: "blue" }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
