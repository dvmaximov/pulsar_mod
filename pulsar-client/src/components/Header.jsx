import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import ToolBar from "@mui/material/ToolBar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import links from "../data/main-links";

const LOGO = "Pulsar";

const Header = ({ toggleOpen }) => {
  const navigate = useNavigate();

  const items = links.map((link) => (
    <ListItem
      button
      key={link.label}
      onClick={() => navigate(link.path, { replace: true })}
    >
      <ListItemText primary={link.label} />
    </ListItem>
  ));

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <ToolBar disableGutters>
          <Typography variant="h6" noWrap component="h1" sx={styles.logoSm}>
            {LOGO}
          </Typography>
          <Box sx={styles.menu}>
            <List component="nav" sx={styles.nav}>
              {items}
            </List>
          </Box>
          <Box sx={styles.icon}>
            <IconButton
              size="large"
              aria-label="open menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={toggleOpen}
              sx={styles.iconButton}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" noWrap component="h1" sx={styles.logoXs}>
            {LOGO}
          </Typography>
        </ToolBar>
      </Container>
    </AppBar>
  );
};

const styles = {
  logoSm: {
    mr: 2,
    display: { xs: "none", sm: "flex" },
  },
  logoXs: {
    flexGrow: 1,
    justifyContent: "flex-end",
    display: { xs: "flex", sm: "none" },
  },
  menu: {
    flexGrow: 1,
    justifyContent: "flex-end",
    display: { xs: "none", sm: "flex" },
  },
  nav: {
    display: "flex",
    flexDirection: "row",
  },
  iconButton: {
    padding: "20px",
  },
  icon: {
    display: { xs: "flex", sm: "none" },
  },
};

export default Header;
