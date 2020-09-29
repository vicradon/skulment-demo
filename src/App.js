import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "./Components/Loader";
import StudentRoutes from "./Routes/Student";
import TeacherRoutes from "./Routes/Teacher";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import ManagerRoutes from "./Routes/Manager";

function App() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [role, setRole] = React.useState();

  React.useEffect(() => {
    if (user) {
      setRole(user["https://fauna.com/user_metadata"].role);
    }
  }, [user]);

  if (isLoading) {
    return <Loader global />;
  }

  if (isAuthenticated) {
    return (
      <React.Fragment>
        <Router>
          {role === "student" && <StudentRoutes />}
          {role === "teacher" && <TeacherRoutes />}
          {role === "manager" && <ManagerRoutes />}
        </Router>
        <ToastContainer />
      </React.Fragment>
    );
  } else {
    return <Home />;
  }
}

export default App;
