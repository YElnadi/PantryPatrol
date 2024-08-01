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
  const [currentItem, setCurrentItem] = useState(null);


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
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    // console.log(`in delete; itemName: "${itemName}" docRef: ${docRef}`)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  //Add Item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    // console.log(`in delete; itemName: "${itemName}" docRef: ${docRef}`)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
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

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
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
          width={400}
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
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              DeleteIcon
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
      <Button variant="contained" onClick={() => handleOpen()}>
        Add New Item
      </Button>
      <Box sx={{ border: "1px solid #333" }}>
        <Box
          width="800px"
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
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="96%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
            >
                <Typography variant="h3" color="#333" >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" >
                  {quantity}
                </Typography>
              <Box display={"flex"} justifyContent={"space-around"}>
                <IconButton
                  onClick={() => {
                    setCurrentItem({name, quantity});
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
