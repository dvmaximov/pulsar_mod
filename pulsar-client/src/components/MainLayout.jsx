import Container from "@mui/material/Container";
import CssBaseLine from "@mui/material/CssBaseLine";

import Header from "./Header";
import SideBar from "./SideBar";

import { useToggle } from "../hooks/useToggle";

const MainLayout = ({ children }) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <Container maxWidth="100vw" disableGutters sx={styles.container}>
      <Header toggleOpen={toggleOpen} />
      <Container sx={styles.content} disableGutters>
        <SideBar open={open} toggleOpen={toggleOpen} />
        {children}
      </Container>
    </Container>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexGrow: 1,
    mt: 8,
  },
};

export default MainLayout;
