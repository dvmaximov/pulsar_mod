import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";

import TaskItem from "../../components/Tasks/TaskItem";
import BaseDialog from "../../components/BaseDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddTask from "../../components/Tasks/AddTask";

import { tasks } from "../../store";

const root = import.meta.env.BASE_URL;

const TaskList = () => {
  const navigate = useNavigate();
  const [openNewTask, setOpenNewTask] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [removeTask, setRemoveTask] = useState(null);

  const onSelect = useCallback((id) => {
    navigate(`/tasks/${id}`);
  }, []);

  useEffect(() => tasks.fetch(), []);

  const onCloseDialog = useCallback(() => {
    setOpenNewTask(false);
  }, []);

  const onOpenDialog = useCallback(() => {
    setOpenNewTask(true);
  }, []);

  const onRemove = (task) => {
    setRemoveTask(task);
    setOpenConfirm(true);
  };

  const onRemoveOk = () => {
    if (removeTask) {
      tasks.remove(removeTask).then(() => {
        setRemoveTask(null);
      });
    }
    setOpenConfirm(false);
  };

  const onRemoveCancel = () => {
    setRemoveTask(null);
    setOpenConfirm(false);
  };

  const onAddTask = useCallback((newTask) => {
    tasks.create({ ...newTask, actions: [] });
    onCloseDialog();
  }, []);

  const items = useMemo(
    () =>
      tasks.taskList.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      )),
    [tasks.taskList]
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
        <Typography variant="h5">Список программ</Typography>
        <Button variant="contained" color="primary" onClick={onOpenDialog}>
          Добавить
        </Button>
      </Box>
      <List>{items}</List>
      <BaseDialog open={openNewTask} onCloseDialog={onCloseDialog}>
        <AddTask
          open={openNewTask}
          onAddTask={onAddTask}
          onCloseDialog={onCloseDialog}
        />
      </BaseDialog>
      <ConfirmDialog
        open={openConfirm}
        onOk={onRemoveOk}
        onCancel={onRemoveCancel}
      >
        <Typography sx={{ mb: 2 }}>Удалить выбранную программу?</Typography>
        <Typography align="center" sx={{ fontWeight: "bold" }}>
          {removeTask?.name}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default observer(TaskList);
