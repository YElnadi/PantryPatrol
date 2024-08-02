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

  const [modalMode, setModalMode] = useState("add");

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

  const handleOpen = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setItemName(item.name);
      setItemQuantity(item.quantity);
      setModalMode("update");
    } else {
      setItemName("");
      setItemQuantity("");
      setModalMode("add");
    }
    setErrorMessage("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  //Delete item from Inventory
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

  //handle add item
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
      handleClose();
    }
  };

  //handle update item
  const handleUpdateItem = async () => {
    setErrorMessage("");
    if (!itemName.trim() || itemQuantity <= 0) {
      setErrorMessage("Please enter a valid name and quantity.");
      return;
    }

    if (modalMode === "update") {
      const { name: oldName } = currentItem;
      if (itemName !== oldName) {
        const newDocRef = doc(collection(firestore, "inventory"), itemName);
        const newDocSnap = await getDoc(newDocRef);

        if (newDocSnap.exists()) {
          setErrorMessage(
            "Name already exists. Please choose a different name. "
          );
          return;
        }
      }
      //update item
      const oldDocRef = doc(collection(firestore, "inventory"), oldName);
      await setDoc(oldDocRef, { quantity: itemQuantity }, { merge: true });

      if (itemName !== oldName) {
        await deleteDoc(doc(collection(firestore, "inventory"), oldName));
      }
    }
    await updateInventory();
    handleClose();
  };

  // const handleCloseModal = () => {
  //   if (!itemName.trim() || itemQuantity <= 0) {
  //     setErrorMessage("Please enter a valid name and quantity.");
  //     return;
  //   }
  //   handleClose();
  // };
  //update data
  // const updateItem = async (oldName, newName, newQuantity) => {
  //   // Check if new name already exists
  //   if (newName) {
  //     const newDocRef = doc(collection(firestore, "inventory"), newName);
  //     const newDocSnap = await getDoc(newDocRef);

  //     if (newDocSnap.exists()) {
  //       // If new name already exists, show an error message and return
  //       setErrorMessage("Name already exists. Please choose a different name.");
  //       return;
  //     }
  //   }

  //   // Check if the item with the old name exists
  //   const oldDocRef = doc(collection(firestore, "inventory"), oldName);
  //   const oldDocSnap = await getDoc(oldDocRef);

  //   if (oldDocSnap.exists()) {
  //     // Prepare update data
  //     const updateData = {};
  //     if (newName) updateData.name = newName;
  //     if (newQuantity !== undefined) updateData.quantity = newQuantity;

  //     // Perform the update
  //     await setDoc(oldDocRef, updateData, { merge: true });

  //     // If the name is updated, delete the old document and rename it
  //     if (newName && newName !== oldName) {
  //       await deleteDoc(doc(collection(firestore, "inventory"), oldName));
  //     }

  //     // Refresh the inventory list
  //     await updateInventory();
  //   } else {
  //     // Show an error message if the item to be updated does not exist
  //     setErrorMessage("Item not found.");
  //   }
  // };

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
      overflow={"hidden"}
      sx={{
        backgroundImage: `url('/inv3.jpg')`, // Ensure the path is correct
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: `no-repeat`,
        overflow: "hidden",
      }}
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
            <Button
              variant="contained"
              onClick={modalMode === "add" ? handleAddItem : handleUpdateItem}
            >
              {modalMode === "add" ? "Add" : "Update"}
            </Button>
          </Stack>
          {errorMessage && (
            <Typography variant="body2" color="red">
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
      <Box
        bgcolor="white"
        display="flex"
        width="900px"
        padding={2}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        borderRadius="8px"
      >
        <Stack spacing={2} direction="row" alignItems={"center"}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              padding: "8px 16px",
            }}
            onClick={() => handleOpen()}
          >
            Add New Item
          </Button>
          <TextField
            variant="outlined"
            placeholder="Search Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              borderRadius: "8px", // Rounded corners
              marginBottom: 2,
              padding: "3px", // Adjust padding for better look
            }}
          />
        </Stack>
      </Box>

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
            Pantry Patrol{" "}
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
                <IconButton onClick={() => handleOpen({ name, quantity })}>
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
