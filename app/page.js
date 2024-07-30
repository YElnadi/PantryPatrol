"use client";
import * as React from 'react';

import { Box, Stack, Typography, Button, Modal } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";


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
export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
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
    updatePantry();
  }, []);
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
        <Button variant="contained" onClick={handleOpen}>ADD</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>


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
                height="300px"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
              >
                <Typography variant="h4" color={"#333"} textAlign={"center"}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
