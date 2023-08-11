import { useEffect } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import StatusAction from "./StatusAction";
import StatusRunWorks from "./StatusRunWorks";
import StatusWaitWorks from "./StatusWaitWorks";

import { works } from "../../store";

const StatusWorks = () => {
  useEffect(() => {
    works.fetch();
  }, []);

  return (
    <Box
      sx={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "5px",
        minHeight: "98%",
        p: 0.5,
        m: 0.5,
      }}
    >
      <Typography>Информация о заданиях</Typography>
      <StatusWaitWorks></StatusWaitWorks>
      <StatusRunWorks></StatusRunWorks>
      <StatusAction></StatusAction>
    </Box>
  );
};

export default StatusWorks;
