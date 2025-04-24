import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import List from "@mui/material/List";

import SettingsItem from "./SettingsItem";
import { settings } from "../../store";

const SettingsList = () => {
  useEffect(() => {
    settings.fetch();
  }, []);

  const onEdit = (setting) => {
    settings.update({ ...setting });
  };

  const settingList = settings.settingList.map((setting) => {
    let editable = true;
    if (setting.id === settings.SETTING.SETTING_VERSION || setting.id === settings.SETTING.SETTING_BALL) editable = false;
    return (
      <SettingsItem
        key={setting.id}
        setting={setting}
        onEdit={onEdit}
        editable={editable}
      ></SettingsItem>
    );
  });

  return (
    <>
      <List sx={{ mb: 2 }}>{settingList}</List>
    </>
  );
};

export default observer(SettingsList);
