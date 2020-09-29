import { useAuth0 } from "@auth0/auth0-react";
import { Button, Flex, Heading } from "@chakra-ui/core";
import React from "react";
import Loader from "../../../Components/Loader";
import { toast } from "react-toastify";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import TeachersTable from "./TeachersTable";
import { getTeachers } from "../functions";
import { Link } from "react-router-dom";

const Teachers = () => {
  const [teachers, setTeachers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    getTeachers(secret)
      .then((teachers) => {
        setTeachers(teachers);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret]);

  return (
    <ManagerDashboardLayout>
      <Flex justify="space-between" align="center">
        <Heading fontWeight="400" size="lg">
          Teachers
        </Heading>
        <Link to={{ pathname: "/add-teacher", state: { role: "teacher" } }}>
          <Button variantColor="blue">
            Add teacher
          </Button>
        </Link>
      </Flex>
      {loading ? <Loader /> : <TeachersTable teachers={teachers} />}
    </ManagerDashboardLayout>
  );
};

export default Teachers;
