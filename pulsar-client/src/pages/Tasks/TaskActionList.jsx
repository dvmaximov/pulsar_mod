import { v4 as newId } from "uuid";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import TaskActionItem from "../../components/Tasks/TaskActionItem";
import TaskActionEdit from "../../components/Tasks/TaskActionEdit";
import AddTask from "../../components/Tasks/AddTask";
import BaseDialog from "../../components/BaseDialog";
import ConfirmDialog from "../../components/ConfirmDialog";

import { tasks } from "../../store";

const TaskActionList = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState(null);
  const [currentTask, setCurrentTask] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [removeAction, setRemoveAction] = useState(null);
  const [openEditTask, setOpenEditTask] = useState(false);

  const onToList = useCallback(() => {
    navigate(`/tasks`);
  }, []);

  useEffect(() => {
    tasks.fetchById(params.id).then((task) => setCurrentTask(task));
  }, []);

  const onCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const onEdit = useCallback((action) => {
    setAction(action);
    setOpenDialog(true);
  }, []);

  const onAddAction = useCallback(() => {
    setAction(null);
    setOpenDialog(true);
  }, []);

  const onRemove = (action) => {
    setRemoveAction(action);
    setOpenConfirm(true);
  };

  const onRemoveOk = () => {
    if (removeAction) {
      const actions = currentTask.actions.filter(
        (item) => removeAction.id !== item.id
      );
      const updatedTask = { ...currentTask, actions };
      setCurrentTask(updatedTask);
      tasks.update(updatedTask).then(() => {
        setRemoveAction(null);
      });
    }
    setOpenConfirm(false);
  };

  const onRemoveCancel = () => {
    setRemoveAction(null);
    setOpenConfirm(false);
  };

  const onSubmit = (action) => {
    if (!action.id) action.id = newId();
    const idx = currentTask.actions.findIndex((item) => item.id === action.id);
    const newActions = [...currentTask.actions];
    if (idx === -1) {
      newActions.push(action);
    } else {
      newActions[idx] = { ...action };
    }
    const updatedTask = { ...currentTask, actions: [...newActions] };
    setCurrentTask(updatedTask);
    setOpenDialog(false);
    tasks.update(updatedTask);
  };

  const items = Array.isArray(currentTask.actions)
    ? currentTask.actions.map((action, index) => (
        <Draggable key={action.id} draggableId={action.id} index={index}>
          {(provided) => (
            <TaskActionItem
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              action={action}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          )}
        </Draggable>
      ))
    : null;

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newActions = reorder(
      currentTask.actions,
      result.source.index,
      result.destination.index
    );
    const updatedTask = { ...currentTask, actions: newActions };
    setCurrentTask(updatedTask);
    tasks.update(updatedTask);
  };

  const reorder = useCallback((list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }, []);

  const onEditTask = ({ name, description, ball }) => {
    const updatedTask = {
      ...currentTask,
      name,
      description,
      ball,
    };
    setCurrentTask(updatedTask);
    setOpenEditTask(false);
    tasks.update(updatedTask);
  };

  const onCloseEditTask = useCallback(() => {
    setOpenEditTask(false);
  }, []);

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
        <Typography variant="h5">Состав программы</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={onToList}
            sx={{ mr: 1 }}
          >
            К списку
          </Button>
          <Button variant="contained" color="primary" onClick={onAddAction}>
            Добавить
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
        }}
      >
        <Button
          color="primary"
          onClick={() => setOpenEditTask(true)}
          sx={{ mr: 1 }}
        >
          Изменить
        </Button>
        <Typography
          variant="h6"
          sx={{
            fontStyle: "italic",
            color: "blue",
            my: 1,
          }}
        >
          {`Наименование: ${currentTask.name || ""}`} <br></br>
          {`Позиция шара: ${currentTask.ball === 0 ? "левый" : "правый"}`}
        </Typography>
      </Box>

      {items && items.length <= 0 && (
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
          Список действий пуст
        </Box>
      )}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="program">
          {(provided) => (
            <List
              className="program"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      <BaseDialog open={openDialog} onCloseDialog={onCloseDialog}>
        <TaskActionEdit
          open={openDialog}
          onCloseDialog={onCloseDialog}
          onSubmit={onSubmit}
          action={action}
        />
      </BaseDialog>
      <ConfirmDialog
        open={openConfirm}
        onOk={onRemoveOk}
        onCancel={onRemoveCancel}
      >
        <Typography sx={{ mb: 2 }}>Удалить выбранное действие?</Typography>
        <Typography align="center" sx={{ fontWeight: "bold" }}>
          {removeAction?.type?.name}
        </Typography>
      </ConfirmDialog>

      <BaseDialog open={openEditTask} onCloseDialog={onCloseEditTask}>
        <AddTask
          task={currentTask}
          open={openEditTask}
          onAddTask={onEditTask}
          onCloseDialog={onCloseEditTask}
        />
      </BaseDialog>
    </Box>
  );
};

export default observer(TaskActionList);
