import Button from "@mui/material/Button";

import { settings } from "../../store";

const SettingsControls = ({ openDialog, openBallDialog, openConfirm, disableAll }) => {
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
          openConfirm("restart");
        }}
        sx={{ mr: 1, mb: 1 }}
      >
        Рестарт
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
      <Button
        disabled={disableAll}
        variant="contained"
        color="primary"
        onClick={() => {
          openBallDialog();
        }}
        sx={{ mr: 1, mb: 1 }}
      >
       Позиция шара
      </Button>
    </>
  );
};

export default SettingsControls;
