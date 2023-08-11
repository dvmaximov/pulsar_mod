import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const ConfirmDialog = ({ open, children, onOk, onCancel }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "80%",
        flexWrap: "wrap",
      }}
    >
      <Dialog open={open} onClose={onCancel}>
        <DialogTitle></DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Отмена</Button>
          <Button onClick={onOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmDialog;
