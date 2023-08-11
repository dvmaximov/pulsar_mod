import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import TaskIcon from "@mui/icons-material/Task";

const root = import.meta.env.BASE_URL;

export default [
  {
    label: "Главная",
    path: `${root}`,
    icon: <HomeIcon color="primary" />,
  },
  {
    label: "Программы",
    path: `${root}tasks`,
    icon: <ListAltIcon color="primary" />,
  },
  {
    label: "Задачи",
    path: `${root}works`,
    icon: <TaskIcon color="primary" />,
  },
  {
    label: "Настройки",
    path: `${root}settings`,
    icon: <SettingsApplicationsIcon color="primary" />,
  },
];
