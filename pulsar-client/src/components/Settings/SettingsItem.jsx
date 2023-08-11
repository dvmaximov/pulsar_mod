import { useState } from "react";

import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import BaseDialog from "../BaseDialog";
import SettingsEdit from "./SettingsEdit";

const SettingsItem = ({ setting, onEdit, editable = true }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const onOpenDialog = () => {
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit = (value) => {
    onEdit({ ...value });
    onCloseDialog();
  };

  return (
    <>
      <ListItem
        key={setting.id}
        sx={{
          justifyContent: "space-between",
          wordWrap: "wrap",
          bgcolor: "#f9f9f9",
        }}
      >
        <Typography sx={{ width: "40%" }}>{setting.name}</Typography>
        <Box
          sx={{
            width: "60%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              fontSize: "1.5rem",
              color: "blue",
            }}
          >
            {setting.value}
          </Typography>
          {editable && <Button onClick={onOpenDialog}>Изменить</Button>}
        </Box>
      </ListItem>
      <BaseDialog open={openDialog} onCloseDialog={onCloseDialog}>
        <SettingsEdit
          onCancel={onCloseDialog}
          onSubmit={onSubmit}
          setting={setting}
        />
      </BaseDialog>
    </>
  );
};

export default SettingsItem;
