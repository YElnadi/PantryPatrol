"use client";
import * as React from "react";

import { Box, Stack, Typography, Button } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "./AddModal";
import UpdateModal from "./UpdateModal";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log('selectedItem', selectedItem)

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      // console.log(doc.id);
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log("pantryList", pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const deleteItem = async (itemName) => {
    const docRef = doc(collection(firestore, "pantry"), itemName);
    await deleteDoc(docRef);
    await updatePantry();
  };

  const updateItem = async (itemName, newName, newQuantity) => {
    //create a ref to the item in firestore
    const docRef = doc(collection(firestore, "pantry"), itemName);
    //update the document with new values
    await setDoc(
      docRef,
      { name: newName, quantity: newQuantity },
      { merge: true }
    );

    //refresh pantryList
    await updatePantry();
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const closeUpdatedModal = () => {
    setSelectedItem(null);
    setUpdateModalOpen(false);
  };

  return (
    <>
      <Box
        display={"flex"}
        height="100vh"
        width="100vw"
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        gap={2}
      >
        <AddModal updatePantry={updatePantry} />

        <Box border={"1px solid #333"}>
          <Box width="1000px" height="100px" bgcolor={"#0096c7"}>
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
              Pantry Patrol
            </Typography>
          </Box>
          <Stack width="1000px" height="500px" spacing={2} overflow={"auto"}>
            {pantry.map((item) => (
              <Box
                key={item.id}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={5}
                sx={{ boxSizing: "border-box" }}
              >
                <Typography
                  variant="h3"
                  color={"#333"}
                  textAlign={"center"}
                  fontWeight={"lighter"}
                >
                  {console.log('itemmmmm', item)}
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </Typography>
                <Typography
                  variant="h3"
                  color={"#333"}
                  textAlign={"center"}
                  fontWeight={"lighter"}
                >
                  {" "}
                  Quantity:{item.quantity}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => openUpdateModal(item)}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  onClick={() => deleteItem(item.name)}
                >
                  Remove
                </Button>

                <UpdateModal />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
      {
        selectedItem && (
          <UpdateModal
          open={isUpdateModalOpen}
          handleClose={closeUpdatedModal}
          item={selectedItem}
          updateItem ={updateItem}
          />
        )
      }
    </>
  );
}
