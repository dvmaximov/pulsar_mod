import { useState } from "react";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import SettingsList from "../components/Settings/SettingsList";
import SettingsControls from "../components/Settings/SettingsControls";
import SettingsCalibrate from "../components/Settings/SettingsCalibrate";
import SettingsBallPosition from "../components/Settings/SettingsBallPosition";
import SettingsBackup from "../components/Settings/SettingsBackup";
import BaseDialog from "../components/BaseDialog";

import { settings } from "../store";

const Settings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openBallDialog, setOpenBallDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [mode, setMode] = useState("azimuth");
  const [confirmMode, setConfirmMode] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [disableAll, setDisableAll] = useState(false);

  const onOpenDialog = (modeValue) => {
    setMode(modeValue);
    setOpenDialog(true);
  };

  const onOpenBallDialog = () => {
    setOpenBallDialog(true);
  };

  const onOpenConfirm = (modeValue) => {
    setConfirmMode(modeValue);
    let message = "";
    switch (modeValue) {
      case "update":
        message = `Обновление займет 3-5 минут.
                   В это время сервер будет недоступен.
                   Не отключайте устройство от питания.

                   Продолжить?
        `;
        break;
      case "shutdown":
        message = `Выключить сервер?
        `;
        break;
      case "restart":
        message = `Перезапустить сервер?
        `;
        break;
    }
    setConfirmMessage(() => message);
    setOpenConfirm(true);
    setDisableAll(true);
  };

  const onSubmitConfirm = () => {
    let submit = () => {};
    switch (confirmMode) {
      case "update":
        submit = settings.updateServer;
        break;
      case "shutdown":
        submit = settings.shutdown;
        break;
      case "restart":
        submit = settings.restart;
        break;
    }
    submit();
    setOpenConfirm(false);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    setOpenBallDialog(false);
  };

  const onCloseConfirm = () => {
    setOpenConfirm(false);
    setDisableAll(false);
  };

  return (
    <>
      <Typography variant="h6">Настройки</Typography>
      <SettingsList></SettingsList>
      <SettingsControls
        openDialog={onOpenDialog}
        openBallDialog={onOpenBallDialog}
        openConfirm={onOpenConfirm}
        disableAll={disableAll}
      ></SettingsControls>

      <SettingsBackup disableAll={disableAll}></SettingsBackup>

      <BaseDialog open={openDialog} onCloseDialog={onCloseDialog}>
        <SettingsCalibrate onCancel={onCloseDialog} mode={mode} />
      </BaseDialog>
      <BaseDialog open={openBallDialog} onCloseDialog={onCloseDialog}>
        <SettingsBallPosition onCancel={onCloseDialog} />
      </BaseDialog>
      <BaseDialog open={openConfirm} onCloseDialog={onCloseConfirm}>
        <DialogTitle>
          <Typography>Подтверждение действия</Typography>
        </DialogTitle>
        <DialogContent>{confirmMessage}</DialogContent>
        <DialogActions>
          <Button onClick={onCloseConfirm}>Отмена</Button>
          <Button onClick={onSubmitConfirm}>Ok</Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default Settings;
