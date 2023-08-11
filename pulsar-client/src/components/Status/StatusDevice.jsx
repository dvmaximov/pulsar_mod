import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";

import SettingsItem from "../Settings/SettingsItem";

import { settings } from "../../store";

const StatusDevice = () => {
  useEffect(() => {
    settings.fetch();
  }, []);

  const settingList = settings.settingList
    ? settings.settingList
        .filter(
          (setting) =>
            setting.id !== settings.SETTING.SETTING_AZIMUTH_SPEED &&
            setting.id !== settings.SETTING.SETTING_SLOPE_SPEED
        )
        .map((setting) => {
          return (
            <SettingsItem
              key={setting.id}
              setting={setting}
              editable={false}
            ></SettingsItem>
          );
        })
    : null;

  return (
    <Box
      sx={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "5px",
        minHeight: "98%",
        p: 0.5,
        m: 0.5,
      }}
    >
      <Typography>Информация об устройстве</Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 2,
          mt: 2,
          color: "blue",
        }}
      >
        <Typography variant="div">Время сервера</Typography>
        <Typography variant="div">{settings.serverTime}</Typography>
      </Box>

      <List sx={{ mb: 2 }}>{settingList}</List>
    </Box>
  );
};

export default observer(StatusDevice);
