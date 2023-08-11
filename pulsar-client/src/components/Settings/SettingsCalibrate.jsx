import { useState } from "react";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";

import { settings, works } from "../../store";

const stepsAzimut = [
  {
    description: `Установите устройство на азимут 0 и нажмите "Далее".`,
    time: 0,
  },
  {
    description: `Поворот подолжительностью 5 сек. После остановки введите
                  значение азимута.`,
    time: 5,
  },
  {
    description: `Поворот подолжительностью 10 сек. После остановки введите
                  значение азимута.`,
    time: 10,
  },
  {
    description: `Поворот подолжительностью 15 сек. После остановки введите
                  значение азимута.`,
    time: 15,
  },
];

const stepsSlope = [
  {
    description: `Установите наклон устройства на 0 и нажмите "Далее".`,
    time: 0,
  },
  {
    description: `Наклон подолжительностью 2 сек. После остановки введите
                  значение угла наклона.`,
    time: 2,
  },
  {
    description: `Наклон подолжительностью 4 сек. После остановки введите
                  значение угла наклона.`,
    time: 4,
  },
  {
    description: `Наклон подолжительностью 6 сек. После остановки введите
                  значение угла наклона.`,
    time: 6,
  },
];

const SettingsCalibrate = ({ onCancel, mode }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [disableStart, setdisableStart] = useState(false);

  let title = "";
  let steps = [];
  switch (mode) {
    case "azimuth":
      title = "Калибровка азимута";
      steps = stepsAzimut;
      break;
    case "slope":
      title = "Калибровка наклона";
      steps = stepsSlope;
      break;
  }

  const maxSteps = steps.length;
  const [result, setResult] = useState(new Array(maxSteps).fill(0));
  const [speeds, setSpeeds] = useState(new Array(maxSteps).fill(0));

  const round = (value, digits = 3) => {
    return Number(value.toFixed(digits));
  };

  const onStart = () => {
    works.stopCurrent();

    setdisableStart(true);
    const time = steps[activeStep].time;
    let calibrate = () => {};
    switch (mode) {
      case "azimuth":
        calibrate = settings.calibrateAzimuth;
        break;
      case "slope":
        calibrate = settings.calibrateSlope;
        break;
    }
    calibrate(time);
  };

  const onStop = () => {
    works.stopCurrent();
    onCancel();
  };

  const onChangeValue = (e) => {
    const newValue = +e.target.value;
    const newResult = [...result];
    const newSpeeds = [...speeds];

    newResult[activeStep] = newValue;
    let newSpeed = round(
      (newValue - newResult[activeStep - 1]) / steps[activeStep].time
    );
    newSpeed = newSpeed <= 0 ? 0 : newSpeed;
    newSpeeds[activeStep] = newSpeed;
    setResult(newResult);
    setSpeeds(newSpeeds);
  };

  const onSubmit = () => {
    works.stopCurrent();

    const speeds = [0]; // для первого незначимого шага
    for (let i = 1; i < steps.length; i++) {
      const value = round((result[i] - result[i - 1]) / steps[i].time);
      speeds.push(value);
    }
    const sumResult = speeds.reduce((sum, item) => sum + item);
    const speed = round(sumResult / (steps.length - 1));
    let setting = {};
    let currentDeviceValue = {};
    switch (mode) {
      case "azimuth":
        setting = { ...settings.settingList[0], value: speed };
        currentDeviceValue = {
          ...settings.settingList[2],
          value: result[result.length - 1],
        };
        break;
      case "slope":
        setting = { ...settings.settingList[1], value: speed };
        currentDeviceValue = {
          ...settings.settingList[3],
          value: result[result.length - 1],
        };
        break;
    }
    if (speed > 0) {
      settings.update(setting);
      settings.update(currentDeviceValue);
    }
    onCancel();
  };

  const onNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setdisableStart(false);
  };

  const onBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setdisableStart(false);
  };

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
          <Box sx={{ p: 2 }}>{steps[activeStep].description}</Box>
          {activeStep !== 0 && (
            <FormControl>
              <Button
                onClick={onStart}
                variant="contained"
                color="primary"
                disabled={disableStart}
                sx={{ width: { md: "50%", xl: "25%" }, mb: 1, ml: 1 }}
              >
                Старт
              </Button>
              <TextField
                sx={{ m: 1 }}
                label="Значение"
                type="number"
                inputProps={{
                  max: 350,
                  min: 0,
                  step: 0.1,
                }}
                value={result[activeStep]}
                onChange={onChangeValue}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Typography sx={{ mx: 1 }}>
                Скорость: {speeds[activeStep]}
              </Typography>
            </FormControl>
          )}
          <MobileStepper
            sx={{ justifySelf: "flex-end" }}
            variant="text"
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={onNext}
                disabled={activeStep === maxSteps - 1}
              >
                Далее
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={onBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Назад
              </Button>
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStop}>Отмена</Button>
        <Button onClick={onSubmit}>Сохранить</Button>
      </DialogActions>
    </>
  );
};

export default SettingsCalibrate;
