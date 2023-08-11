import { observer } from "mobx-react-lite";
import { useState, useMemo } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import getTime from "date-fns/getTime";
import ru from "date-fns/locale/ru";

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

import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";

import { dictonary } from "../../store";

const AddWork = ({ task, onSubmit, onCancel }) => {
  const initialType = useMemo(
    () =>
      dictonary.workTypes.find(
        (item) => item.id === dictonary.WORK.WORK_PROGRAMM
      ),
    []
  );

  const initialStatus = useMemo(
    () =>
      dictonary.statusTypes.find(
        (item) => item.id === dictonary.STATUS.STATUS_RUN
      ),
    []
  );

  const initialWork = useMemo(
    () => ({
      type: initialType,
      status: initialStatus,
      item: task,
      startTime: null,
      details: [],
    }),
    []
  );

  const [work, setWork] = useState(initialWork);
  const [status, setStatus] = useState(initialStatus);
  const [dateTime, setDateTime] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale: ru })
  );
  // const [dateTime, setDateTime] = useState(
  //   new Date("2018-01-01T00:00:00.000Z")
  // );

  const onDateTimeChange = (e) => {
    const formated = format(e, "yyyy-MM-dd'T'HH:mm", { locale: ru });
    const startTime = getTime(parseISO(formated));
    setDateTime(formated);
    setWork({
      ...work,
      startTime,
    });
  };

  const onStatusChange = (e) => {
    const newStatus = e.target.value;
    let startTime = null;
    setStatus(newStatus);
    if (newStatus.id === dictonary.STATUS.STATUS_WAIT) {
      startTime = getTime(parseISO(dateTime));
    }
    setWork({
      ...work,
      status: newStatus,
      startTime,
    });
  };

  const statuses = useMemo(
    () =>
      dictonary.statusTypes.map(
        (item) =>
          (item.id === dictonary.STATUS.STATUS_RUN ||
            item.id === dictonary.STATUS.STATUS_WAIT) && (
            <MenuItem key={item.id} value={item}>
              {item.name}
            </MenuItem>
          )
      ),
    []
  );

  return (
    <>
      <DialogTitle>
        <Typography>Задание</Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl fullWidth sx={styles.gutters}>
            <Select autoFocus value={status} onChange={onStatusChange}>
              {statuses}
            </Select>
          </FormControl>
          {status.id === dictonary.STATUS.STATUS_WAIT && (
            <FormControl>
              {/* <TextField
                label="Дата и время"
                type="datetime-local"
                value={dateTime}
                onChange={onDateTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
              <MobileDateTimePicker
                value={dateTime}
                onChange={onDateTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button onClick={() => onSubmit(work)}>Сохранить</Button>
      </DialogActions>
    </>
  );
};

const styles = {
  gutters: {
    my: 1,
  },
};

export default observer(AddWork);
