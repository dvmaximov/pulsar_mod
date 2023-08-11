import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";

import { dictonary } from "../../store";
import { useStatusBgColor } from "../../hooks/useStatusBgColor";

const CurrentWorkItem = ({ work }) => {
  const bgColor = useStatusBgColor(work.status);

  let value = "";
  switch (work.type.id) {
    case dictonary.ACTION.ACTION_AZIMUTH:
    case dictonary.ACTION.ACTION_SLOPE:
      value = work.value1 + " град.";
      break;
    case dictonary.ACTION.ACTION_WAIT:
      value = work.value1 + " сек.";
      break;
    case dictonary.ACTION.ACTION_SPARK:
      value = work.value2 + " сек.";
      break;
  }
  return (
    <>
      <ListItem
        sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          bgcolor: bgColor,
          mb: 1,
        }}
        key={work.id}
      >
        <Typography
          sx={{
            width: { xs: "100%", sm: "15%", md: "15%" },
            fontWeight: "bold",
          }}
        >
          {work.type.name}
        </Typography>
        <Typography
          sx={{
            width: { xs: "100%", sm: "15%", md: "15%" },
            textAlign: { xs: "left", sm: "center" },
          }}
        >
          {value}
        </Typography>{" "}
        <Typography
          sx={{
            width: { xs: "100%", sm: "20%" },
            textAlign: { xs: "left", sm: "right" },
            fontWeight: "bold",
          }}
        >
          {work.status.name}
        </Typography>
      </ListItem>
    </>
  );
};

export default CurrentWorkItem;
