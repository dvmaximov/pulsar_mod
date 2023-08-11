import { useState } from "react";
import { observer } from "mobx-react-lite";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { settings } from "../../store";

const SettingsEdit = ({ setting, onCancel, onSubmit }) => {
  const [value, setValue] = useState({ ...setting });

  const onChangeValue = (e) => {
    let newValue = e.target.value;

    if (value.id !== settings.SETTING.SETTING_CURRENT_SLOPE) {
      newValue = newValue.replace(/-/g, "");
    }

    setValue({ ...value, value: newValue });
  };

  const formatSetting = () => {
    const newValue = { ...value };
    newValue.value = Number((+newValue.value).toFixed(3));
    return { ...newValue };
  };

  return (
    <>
      <DialogTitle>
        <Typography>Значение параметра</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <TextField
              autoFocus
              sx={{ m: 1 }}
              label="Значение"
              type="number"
              inputProps={{
                max: 350,
                min: 0,
                step: 0.1,
              }}
              value={value.value}
              onChange={onChangeValue}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button onClick={() => onSubmit(formatSetting(value))}>
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

export default observer(SettingsEdit);
