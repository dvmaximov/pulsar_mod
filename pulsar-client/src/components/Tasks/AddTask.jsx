import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useFieldError } from "../../hooks/useFieldError";

const AddTask = ({ open, onAddTask, onCloseDialog, task }) => {
  const [nameError, nameTextError, setNameError] = useFieldError(
    "Имя не может быть пустым."
  );
  const [title, setTitle] = useState("Новая программа");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onNameChange = (e) => {
    const value = e.target.value;
    setNameError(!value);
    setName(e.target.value);
  };

  const onSubmit = () => {
    if (!name) {
      setNameError(true);
      return;
    }
    onAddTask({ name, description });
  };

  useEffect(() => {
    if (open) {
      if (task) {
        setName(task.name);
        setDescription(task.description);
        setTitle("Изменить программу");
      } else {
        setName("");
        setDescription("");
      }
      setNameError(false);
    }
  }, [open]);

  return (
    <>
      <DialogTitle>
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            autoFocus
            error={nameError}
            label="Наименование"
            value={name}
            helperText={nameTextError}
            variant="filled"
            onChange={onNameChange}
            sx={{ mb: 1 }}
          />
          <TextField
            label="Описание"
            value={description}
            variant="filled"
            multiline
            maxRows={4}
            onChange={onDescriptionChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog}>Отмена</Button>
        <Button onClick={onSubmit}>{task ? "Изменить" : "Добавить"}</Button>
      </DialogActions>
    </>
  );
};

export default AddTask;
