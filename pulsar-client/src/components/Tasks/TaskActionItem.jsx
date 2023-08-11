import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";

const TaskActionItem = ({ action, onRemove, onEdit, innerRef, ...rest }) => {
  return (
    <ListItem
      ref={innerRef}
      {...rest}
      sx={{
        color: "text.primary",
        mb: 0.5,
        p: 0.2,
        width: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          bgcolor: "#ffffff",
          width: "80%",
          border: "1px solid #001e3c",
          borderRadius: "2px",
          flexWrap: "wrap",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#f1f1f1",
            color: "text.secondary",
          },
        }}
        onClick={() => onEdit(action)}
      >
        <Typography
          variant="p"
          component="span"
          sx={{ width: { xs: "100%", sm: "40%" }, padding: 1 }}
        >
          {action.type.name}
        </Typography>
        <Typography
          variant="p"
          component="span"
          sx={{
            padding: 1,
          }}
        >
          {action.type.id === 1 && (
            <Typography>
              азимут <span>{action.value1}</span> градусов
            </Typography>
          )}
          {action.type.id === 2 && (
            <Typography>
              наклон <span>{action.value1}</span> градусов
            </Typography>
          )}
          {action.type.id === 3 && (
            <Typography>
              ожидание <span>{action.value1}</span> сек
            </Typography>
          )}
          {action.type.id === 4 && (
            <Typography>
              разряд кол-во <span>{action.value1}</span> время&nbsp;
              <span>{action.value2}</span> сек интервал&nbsp;
              <span>{action.value3}</span> сек
            </Typography>
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          flexGrow: 1,
          justifyContent: "center",
          ml: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => onRemove(action)}
        >
          удалить
        </Button>
      </Box>
    </ListItem>
  );
};

export default observer(TaskActionItem);
