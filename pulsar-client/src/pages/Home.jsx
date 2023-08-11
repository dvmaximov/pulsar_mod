import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import StatusWorks from "../components/Status/StatusWorks";
import StatusDevice from "../components/Status/StatusDevice";

const Home = () => {
  return (
    <>
      <Typography
        sx={{
          color: "red",
          border: "2px solid red",
          borderRadius: 1,
          fontWeight: "bold",
          width: "80%",
          m: "10px auto",
          p: 1,
        }}
      >
        ВНИМАНИЕ!!! Перед работой проверьте правильновть выставленного азимута и
        наклона!!!
      </Typography>
      <Box
        sx={{
          bgcolor: "#f9f9f9",
          p: 1,
          minHeight: "85%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            padding: 1,
            width: { xs: "100%", sm: "45%" },
            minHeight: "95%",
          }}
        >
          <StatusWorks />
        </Box>
        <Box
          sx={{
            padding: 1,
            width: { xs: "100%", sm: "45%" },
            minHeight: "95%",
          }}
        >
          <StatusDevice />
        </Box>
      </Box>
    </>
  );
};

export default Home;
