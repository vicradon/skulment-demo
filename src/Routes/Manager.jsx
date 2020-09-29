import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Manager/Home";
import NotFound from "../Components/NotFound";
import ManagerDashboardLayout from "../Layouts/ManagerDashboard";
import Courses from "../Pages/Manager/Courses/Courses.jsx";
import Teachers from "../Pages/Manager/Teachers/Teachers";
import Teacher from "../Pages/Manager/Teachers/Teacher";
import Course from "../Pages/Manager/Courses/Course";
import Students from "../Pages/Manager/Students/Students";
import AddCourse from "../Pages/Manager/Courses/AddCourse";
import AddUser from "../Pages/Manager/Shared/AddUser";

function ManagerRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/students" component={Students} exact />
      <Route path="/add-student" component={AddUser} />
      <Route path="/courses" component={Courses} exact />
      <Route path="/courses/:id" component={Course} />
      <Route path="/add-course" component={AddCourse} />
      <Route path="/teachers" component={Teachers} exact />
      <Route path="/teachers/:id" component={Teacher} />
      <Route path="/add-teacher" component={AddUser} />
      <Route path="*">
        <ManagerDashboardLayout>
          <NotFound />
        </ManagerDashboardLayout>
      </Route>
    </Switch>
  );
}

export default ManagerRoutes;
