import { Box, Stack, Typography } from "@mui/material";

const items = [
  "tomatoes",
  "Carrot",
  "potato",
  "onion",
  "garlic",
  "ginger",
  "kale",
  "lemon",
  "mint",
  "strawberry",
];

export default function Home() {
  return (
    <>
      <Box
        display={"flex"}
        height="100vh"
        width="100vw"
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Box border={"1px solid #333"}>
          <Box
            width="800px"
            height="100px"
            bgcolor={"#0096c7"}
            border={"1px solid #333"}
          >
            <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
              Pantry Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
            {items.map((item) => (
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
