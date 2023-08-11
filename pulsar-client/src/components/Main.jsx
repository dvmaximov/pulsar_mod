import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";

const MainElement = styled("main")({
  flexGrow: 1,
  margin: 10,
});

const Main = () => {
  return (
    <MainElement>
      <Outlet />
    </MainElement>
  );
};

export default Main;
