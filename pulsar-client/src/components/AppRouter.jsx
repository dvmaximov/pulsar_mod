import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Main from "./Main";
import MainLayout from "./MainLayout";
import Home from "../pages/Home";
import Tasks from "../pages/Tasks";
import Works from "../pages/Works";
import TaskList from "../pages/Tasks/TaskList";
import WorkList from "../pages/Works/WorkList";
import CurrentWork from "../pages/Works/CurrentWork";
import TaskActionList from "../pages/Tasks/TaskActionList";
import Settings from "../pages/Settings";
import Repair from "../pages/Repair";

// const Works = lazy(() => import("../pages/Works"));

const root = import.meta.env.BASE_URL;

const AppRouter = ({ routes }) => {
  return (
    <>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path={`${root}`} element={<Main />}>
              <Route path={`${root}`} element={<Home />} />
              <Route path={`${root}remont`} element={<Repair />} />
              <Route path={`${root}tasks`} element={<Tasks />}>
                <Route path={`${root}tasks`} element={<TaskList />} />
                <Route path={`${root}tasks:id`} element={<TaskActionList />} />
              </Route>
              <Route path={`${root}works`} element={<Works />}>
                <Route path={`${root}works`} element={<WorkList />} />
                <Route path="/works/current-work" element={<CurrentWork />} />
              </Route>
              <Route path={`${root}settings`} element={<Settings />}></Route>
              <Route path={`*`} element={<Home />}></Route>
            </Route>
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </>
  );
};
export default AppRouter;
