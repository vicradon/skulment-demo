import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Student/Home";
import NotFound from "../Components/NotFound";
import StudentDashboardLayout from "../Layouts/StudentDashboard";
import Courses from "../Pages/Student/Courses";
import Course from "../Pages/Student/Course";

function StudentRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/courses" component={Courses} exact />
      <Route path="/courses/:id" component={Course} />
      <Route path="*">
        <StudentDashboardLayout>
          <NotFound />
        </StudentDashboardLayout>
      </Route>
    </Switch>
  );
}

export default StudentRoutes;
