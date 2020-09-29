import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Teacher/Home";
import NotFound from "../Components/NotFound";
import TeacherDashboardLayout from "../Layouts/TeacherDashboard";
import AssignedCourses from "../Pages/Teacher/AssignedCourses";
import CoursePage from "../Pages/Teacher/CoursePage";

function TeacherRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/courses" component={AssignedCourses} exact />
      <Route path="/courses/:id" component={CoursePage} />
      <Route path="*">
        <TeacherDashboardLayout>
          <NotFound />
        </TeacherDashboardLayout>
      </Route>
    </Switch>
  );
}

export default TeacherRoutes;
