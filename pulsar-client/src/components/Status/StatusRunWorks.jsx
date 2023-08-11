import { observer } from "mobx-react-lite";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { works, dictonary } from "../../store";

const StatusRunWorks = () => {
  const runWorks = works.workList
    .filter((item) => item.status.id === dictonary.STATUS.STATUS_RUN)
    .map((work) => <ListItem key={work.id}>{work.item.name}</ListItem>);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#cdcdcd",
        p: 1,
        mb: 2,
      }}
    >
      <Typography variant="span">Текущая задача </Typography>
      {runWorks.length === 0 && (
        <Typography variant="span">отсутствует</Typography>
      )}
      {runWorks.length !== 0 && <List>{runWorks}</List>}
    </Box>
  );
};

export default observer(StatusRunWorks);
