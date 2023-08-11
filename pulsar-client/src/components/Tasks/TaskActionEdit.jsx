import { observer } from "mobx-react-lite";
import { useState, useMemo } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { dictonary } from "../../store";

const TaskActionEdit = ({ action, onSubmit, onCloseDialog }) => {
  const initialType = useMemo(
    () => ({
      id: dictonary.actionTypes[0].id,
      name: dictonary.actionTypes[0].name,
    }),
    []
  );

  const initialAction = useMemo(
    () => ({
      id: null,
      type: initialType,
      value1: 0.0,
      value2: 0.0,
      value3: 0.0,
    }),
    []
  );

  const [currentAction, setCurrentAction] = useState(action || initialAction);
  const [currentType, setCurrentType] = useState(() =>
    dictonary.actionTypes.find((item) => item.id === currentAction.type.id)
  );

  const onValueChange = (e) => {
    // [0-9]+([\.,][0-9]+)?
    let value = e.target.value;

    //только наклон может быть отрицательным
    if (currentAction.type.id !== dictonary.ACTION.ACTION_SLOPE) {
      value = value.replace(/-/g, "");
    }

    let changed = {};
    switch (e.target.dataset["source"]) {
      case "value1":
        changed = { value1: value };
        break;
      case "value2":
        changed = { value2: value };
        break;
      case "value3":
        changed = { value3: value };
        break;
    }

    setCurrentAction(() => ({ ...currentAction, ...changed }));
  };

  const onTypeChange = (e) => {
    const type = e.target.value;
    setCurrentType(type);
    setCurrentAction({
      ...currentAction,
      type: { id: type.id, name: type.name },
      value1: 0,
      value2: 0,
      value3: 0,
    });
  };

  const types = useMemo(
    () =>
      dictonary.actionTypes.map((type) => (
        <MenuItem key={type.id} value={type}>
          {type.name}
        </MenuItem>
      )),
    []
  );

  const formatAction = () => {
    const newAction = { ...currentAction };
    newAction.value1 =
      newAction.type.id === dictonary.ACTION.ACTION_SPARK
        ? Number(String(newAction.value1).split(".")[0])
        : Number((+newAction.value1).toFixed(1));
    newAction.value2 = Number((+newAction.value2).toFixed(1));
    newAction.value3 = Number((+newAction.value3).toFixed(1));
    return { ...newAction };
  };

  return (
    <>
      <DialogTitle>
        <Typography>Действие</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl fullWidth sx={styles.gutters}>
            <Select autoFocus value={currentType} onChange={onTypeChange}>
              {types}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label={currentType.value1.label}
              value={currentAction.value1}
              onChange={onValueChange}
              type="number"
              inputProps={{
                "data-source": "value1",
                max: currentType.value1.max,
                min: currentType.value1.min,
                step: currentType.value1.step,
              }}
              sx={styles.gutters}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          {currentType.id === dictonary.ACTION.ACTION_SPARK && (
            <TextField
              label={currentType.value2.label}
              value={currentAction.value2}
              onChange={onValueChange}
              type="number"
              inputProps={{
                "data-source": "value2",
                max: currentType.value2.max,
                min: currentType.value2.min,
                step: currentType.value2.step,
              }}
              sx={styles.gutters}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {currentType.id === dictonary.ACTION.ACTION_SPARK && (
            <TextField
              label={currentType.value3.label}
              value={currentAction.value3}
              onChange={onValueChange}
              type="number"
              inputProps={{
                "data-source": "value3",
                max: currentType.value3.max,
                min: currentType.value3.min,
                step: currentType.value3.step,
              }}
              sx={styles.gutters}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog}>Отмена</Button>
        <Button onClick={() => onSubmit(formatAction(currentAction))}>
          Сохранить
        </Button>
      </DialogActions>
    </>
  );
};

const styles = {
  gutters: {
    my: 1,
  },
};

export default observer(TaskActionEdit);
