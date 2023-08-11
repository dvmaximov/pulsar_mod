import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import links from "../data/main-links";

import CloseIcon from "@mui/icons-material/Close";

const SideBar = ({ open, toggleOpen }) => {
  const navigate = useNavigate();

  const onNavigate = (path) => {
    navigate(path, { replace: true });
    toggleOpen();
  };

  const items = links.map((link) => (
    <ListItem button key={link.label} onClick={() => onNavigate(link.path)}>
      <ListItemIcon>{link.icon}</ListItemIcon>
      <ListItemText primary={link.label} />
    </ListItem>
  ));

  return (
    <Drawer sx={styles.drawer} open={open} onClose={toggleOpen}>
      <Box sx={{ display: { xs: "flex", sm: "none" } }}>
        <Typography>Pulsar</Typography>
        <IconButton
          size="large"
          aria-label="open menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={toggleOpen}
          sx={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List component="nav">{items}</List>
    </Drawer>
  );
};

const styles = {
  drawer: {
    width: 300,
    "& .MuiDrawer-paper": {
      width: 300,
      boxSizing: "border-box",
      top: "auto",
      padding: "10px 10px",
    },
  },
  closeButton: {
    color: "text.secondary",
  },
};

export default SideBar;
