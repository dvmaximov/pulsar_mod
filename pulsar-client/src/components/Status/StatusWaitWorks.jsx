import { observer } from "mobx-react-lite";
import format from "date-fns/format";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { works, dictonary } from "../../store";

const StatusWaitWorks = () => {
  const waitWorks = works.workList
    .filter((item) => item.status.id === dictonary.STATUS.STATUS_WAIT)
    .map((work) => {
      const date = format(work.startTime, "dd-MM-yyyy - HH:mm");

      return (
        <ListItem
          key={work.id}
          sx={{ flexWrap: "wrap", justifyContent: "space-between" }}
        >
          <Box variant="div" sx={{ width: "70%" }}>
            {work.item.name}
          </Box>
          <Box variant="div" sx={{ color: "blue" }}>
            {date}
          </Box>
        </ListItem>
      );
    });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#cdcdcd",
        p: 1,
        my: 2,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="span">Запланированные</Typography>
      {waitWorks.length === 0 && (
        <Typography variant="span">отсутствуют</Typography>
      )}
      {waitWorks.length !== 0 && (
        <List sx={{ width: "100%" }}>{waitWorks}</List>
      )}
    </Box>
  );
};

export default observer(StatusWaitWorks);
