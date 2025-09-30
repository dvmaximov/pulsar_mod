import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";

import WorkItem from "../../components/Works/WorkItem";
import ConfirmDialog from "../../components/ConfirmDialog";

import { works } from "../../store";

const WorkList = () => {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openClearConfirm, setOpenClearConfirm] = useState(false);
  const [removeWork, setRemoveWork] = useState(null);

  useEffect(() => works.fetch(), []);

  const onRemove = (work) => {
    setRemoveWork(work);
    setOpenConfirm(true);
  };

  const onClear = () => {
    setOpenClearConfirm(true);
  };

  const onRemoveOk = () => {
    if (removeWork) {
      works.remove(removeWork).then(() => {
        setRemoveWork(null);
      });
    }
    setOpenConfirm(false);
  };

  const onRemoveCancel = () => {
    setRemoveWork(null);
    setOpenConfirm(false);
  };

  const onClearOk = () => {
    works.clear().then(() => {
      works.fetch();
    });
    setOpenClearConfirm(false);
  };
  
  const onClearCancel = () => {
    setOpenClearConfirm(false);
  };

  const items = useMemo(
    () =>
      works.workList.map((work) => (
        <WorkItem
          key={work.id}
          work={work}
          // onSelect={onSelect}
          onRemove={onRemove}
        />
      )),
    [works.workList]
  );

  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",
        padding: 1,
        minHeight: "98%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5">Список установленных задач</Typography>
        <Button variant="outlined" size="small" onClick={() => onClear()}>
          Очистить
        </Button>
      </Box>
      <List>{items}</List>
      <ConfirmDialog
        open={openConfirm}
        onOk={onRemoveOk}
        onCancel={onRemoveCancel}
      >
        <Typography sx={{ mb: 2 }}>Удалить выбранную задачу?</Typography>
        <Typography align="center" sx={{ fontWeight: "bold" }}>
          {removeWork?.status?.name} {removeWork?.item?.name}
        </Typography>
      </ConfirmDialog>

      <ConfirmDialog
        open={openClearConfirm}
        onOk={onClearOk}
        onCancel={onClearCancel}
      >
        <Typography sx={{ mb: 2 }}>Удалить задачи (отменено, завершено, пропущено)?</Typography>
        <Typography align="center" sx={{ fontWeight: "bold" }}>
          {removeWork?.status?.name} {removeWork?.item?.name}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default observer(WorkList);
