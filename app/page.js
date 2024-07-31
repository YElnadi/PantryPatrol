"use client";
import * as React from "react";

import { Box, Stack, Typography, Button } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "./AddModal";

export default function Home() {
  const [pantry, setPantry] = useState([]);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      // console.log(doc.id);
      pantryList.push(doc.id);
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    deleteDoc(docRef).then(()=>{
      updatePantry();
    });
    
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
          <Box width="800px" height="100px" bgcolor={"#0096c7"}>
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
              Pantry Patrol
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
            {pantry.map((item) => (
              <Box
                key={item}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX = {5}
                sx={{ boxSizing: 'border-box' }}
              >
                <Typography
                  variant="h3"
                  color={"#333"}
                  textAlign={"center"}
                  fontWeight={"lighter"}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Typography>

                <Button variant="contained" onClick={() => deleteItem(item)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
