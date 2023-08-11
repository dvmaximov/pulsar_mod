import { useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import CurrentWorkItem from "../../components/Works/CurrentWorkItem";

import { works } from "../../store";

const CurrentWork = () => {
  const onStop = useCallback(() => {
    works.stopCurrent();
  }, []);

  useEffect(() => {
    works.fetchCurrentWork();
  }, []);

  let details = null;
  const currentWork = works.currentWork?.work;
  if (currentWork) {
    details = currentWork.details.map((detail) => {
      return <CurrentWorkItem key={detail.id} work={detail} />;
    });
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#cdcdcd",
          px: 1,
        }}
      >
        <Typography variant="h6">Текущая задача</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onStop}
            sx={{ m: 1 }}
          >
            Остановить
          </Button>
        </Box>
      </Box>
      {!details && (
        <Box
          sx={{
            my: 10,
            fontWeight: "bold",
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Нет текущей задачи
        </Box>
      )}
      <List>{details}</List>
    </>
  );
};

export default observer(CurrentWork);
