import Dialog from "@mui/material/Dialog";

const BaseDialog = (props) => {
  const { open, onCloseDialog, children } = props;
  return (
    <Dialog
      open={open}
      onClose={onCloseDialog}
      sx={{
        "& .MuiPaper-root": { width: { xs: "98%", sm: "50%" } },
      }}
    >
      {children}
    </Dialog>
  );
};

export default BaseDialog;
