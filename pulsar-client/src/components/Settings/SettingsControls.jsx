import Button from "@mui/material/Button";

import { settings } from "../../store";

const SettingsControls = ({ openDialog, openConfirm, disableAll }) => {
  const onSubmitUpdate = () => {
    settings.shutdown;
  };

  return (
    <>
      <Button
        disabled={disableAll}
        variant="contained"
        color="primary"
        onClick={() => {
          openConfirm("update");
        }}
        sx={{ mr: 1, mb: 1 }}
      >
        Обновление сервера
      </Button>
      <Button
        disabled={disableAll}
        variant="contained"
        color="primary"
        onClick={() => {
          openConfirm("shutdown");
        }}
        sx={{ mr: 1, mb: 1 }}
      >
        Выключить устройство
      </Button>
      <Button
        disabled={disableAll}
        variant="contained"
        color="primary"
        onClick={() => {
          openDialog("azimuth");
        }}
        sx={{ mr: 1, mb: 1 }}
      >
        Калибровка азимута
      </Button>
      <Button
        disabled={disableAll}
        variant="contained"
        color="primary"
        onClick={() => {
          openDialog("slope");
        }}
        sx={{ mr: 1, mb: 1 }}
      >
        Калибровка наклона
      </Button>
    </>
  );
};

export default SettingsControls;
