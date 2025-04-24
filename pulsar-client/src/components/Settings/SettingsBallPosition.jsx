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

const SettingsBallPosition = ({ onCancel }) => {
  const [value, setValue] = useState( 0.2 );
  const [disable, setDisable] = useState( false );

  const onChangeValue = (e) => {
    let newValue = e.target.value;
    setValue(newValue);
  };

  const rotateCCW = async () => {
    setDisable(true);
    await settings.rotateCCW(value);
    setDisable(false);
  }

  const rotateCW = async () => {
    setDisable(true);
    await settings.rotateCW(value);
    setDisable(false);
  }

  return (
    <>
      <DialogTitle>
        <Typography>Установка позиции шара</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            width:"100%",
          }}
        > <FormControl sx={{ width:"100%",display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Button onClick={rotateCCW}>против часовой</Button>
            <TextField
              autoFocus
              sx={{ m: 1, width: "40%"}}
              label="Значение угла поворота"
              type="number"
              inputProps={{
                max: 2,
                min: 0.2,
                step: 0.1,
              }}
              value={value}
              onChange={onChangeValue}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button onClick={rotateCW}>по часовой</Button>
          </FormControl> 
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
      </DialogActions>
    </>
  );
};

const styles = {
  gutters: {
    my: 1,
  },
};

export default observer(SettingsBallPosition);
