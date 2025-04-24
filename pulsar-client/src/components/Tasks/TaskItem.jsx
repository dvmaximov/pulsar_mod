import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";

import BaseDialog from "../BaseDialog";
import AddWork from "./AddWork";

import { works, dictonary } from "../../store";

const TaskItem = ({ task, onSelect, onRemove }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const onOpenDialog = () => {
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const onCreateWork = async (work) => {
    await works.create(work);
    setOpenDialog(false);
    if (work.status.id === dictonary.STATUS.STATUS_RUN) {
      navigate(`/works/current-work`);
    }
  };

  return (
    <>
      <ListItem
        sx={{
          color: "text.primary",
          mb: 0.5,
          p: 0.2,
          width: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            bgcolor: "#ffffff",
            width: "80%",
            border: "1px solid #001e3c",
            borderRadius: "2px",
            cursor: "pointer",
            flexWrap: "wrap",
            "&:hover": {
              bgcolor: "#f1f1f1",
              color: "text.secondary",
            },
            alignItems: "center",
          }}
          onClick={() => onSelect(task.id)}
        >
          <Typography
            variant="p"
            component="span"
            sx={{ width: { xs: "100%", sm: "40%" }, padding: 1 }}
          >
            {task.name}
          </Typography>
          <Typography
            variant="p"
            component="span"
            sx={{
              width: "30%",
              padding: 1,
              fontSize: "caption.fontSize",
            }}
          >
            {task.description}
          </Typography>
          <Typography
            variant="p"
            component="span"
            sx={{ width: { sm: "20%" }, padding: 1, textAlign: "right" }}
          >
            {task.ball === 0 ? "левый" : "правый"}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            flexGrow: 1,
            justifyContent: "center",
            ml: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ mr: { xs: 0, sm: 0.5 }, mb: { xs: 0.5, sm: 0 } }}
            onClick={onOpenDialog}
          >
            запуск
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onRemove(task)}
          >
            удалить
          </Button>
        </Box>
      </ListItem>
      <BaseDialog open={openDialog} onCloseDialog={onCloseDialog}>
        <AddWork onCancel={onCloseDialog} onSubmit={onCreateWork} task={task} />
      </BaseDialog>
    </>
  );
};

export default observer(TaskItem);
