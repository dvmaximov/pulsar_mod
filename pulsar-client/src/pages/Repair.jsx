import { observer } from "mobx-react-lite";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { settings } from "../store";

const Repair = () => {
  const onClick = () => {
    settings.repair();
  };

  return (
    <>
      <Typography
        sx={{
          color: "red",
          border: "2px solid red",
          borderRadius: 1,
          fontWeight: "bold",
          width: "80%",
          m: "10px auto",
          p: 1,
        }}
      >
        Ремонт
      </Typography>
      <Box
        sx={{
          bgcolor: "#f9f9f9",
          p: 1,
          // minHeight: "25%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={onClick}>
          Старт
        </Button>
      </Box>
    </>
  );
};

export default observer(Repair);
