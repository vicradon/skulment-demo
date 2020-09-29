import { useAuth0 } from "@auth0/auth0-react";
import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/core";
import React from "react";
import { toast } from "react-toastify";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import StudentTable from "./StudentTable";
import { getStudents } from "../functions";
import Loader from "../../../Components/Loader";
import { Link } from "react-router-dom";

const Students = () => {
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState([]);
  const { token } = useAuth0().user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    getStudents(token)
      .then((students) => {
        setLoading(false);
        setStudents(students);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [token]);

  return (
    <ManagerDashboardLayout>
      <Flex justify="space-between" align="center">
        <Heading fontWeight="400" size="lg">
          Students
        </Heading>
        <Link to={{ pathname: "/add-student", state: { role: "student" } }}>
          <Button
            variantColor="blue"
          >
            Add Student
          </Button>
        </Link>
      </Flex>
      {loading ? <Loader /> : <StudentTable students={students} />}
    </ManagerDashboardLayout>
  );
};

export default Students;
