import { useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import { works, dictonary } from "../../store";

const StatusAction = () => {
  useEffect(() => {
    works.fetchCurrentWork();
  }, []);

  const navigate = useNavigate();

  const onDetails = useCallback(() => {
    navigate(`/works/current-work`);
  }, []);

  const onStop = useCallback(() => {
    works.stopCurrent();
  }, []);

  let details = [];
  const currentWork = works.currentWork?.work;
  if (currentWork) {
    details = currentWork.details
      .filter((item) => item.status.id === dictonary.STATUS.STATUS_RUN)
      .map((detail) => {
        return <ListItem key={detail.id}>{detail.type.name}</ListItem>;
      });
  }

  return (
    <>
      {/* <Box
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
      </Box> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          bgcolor: "#cdcdcd",
        }}
      >
        <Typography variant="span">Текущее действие</Typography>

        {details.length === 0 && (
          <Typography variant="span">отсутствует</Typography>
        )}
        {details.length !== 0 && <List>{details}</List>}
      </Box>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          bgcolor: "#cdcdcd",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onDetails}
          sx={{ m: 1 }}
        >
          Подробнее
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onStop}
          sx={{ m: 1 }}
        >
          Остановить
        </Button>
      </Box>
    </>
  );
};

export default observer(StatusAction);
