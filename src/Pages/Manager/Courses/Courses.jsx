import { useAuth0 } from "@auth0/auth0-react";
import { Button, Flex, Heading, Box, useDisclosure } from "@chakra-ui/core";
import React from "react";
import Loader from "../../../Components/Loader";
import { toast } from "react-toastify";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import CourseTable from "./CourseTable";
import { getCourses } from "../functions";
import { Link } from "react-router-dom";

const Courses = () => {
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);
  const { token } = useAuth0().user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    getCourses(token)
      .then((courses) => {
        setLoading(false);
        setCourses(courses);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, []);

  return (
    <ManagerDashboardLayout>
      <Flex justify="space-between" align="center">
        <Heading fontWeight="400" size="lg">
          Courses
        </Heading>
        <Link to="add-course">
          <Button variantColor="blue" bg="brand.blue.800">
            Add course
          </Button>
        </Link>
      </Flex>
      {loading ? <Loader /> : <CourseTable courses={courses} />}
    </ManagerDashboardLayout>
  );
};

export default Courses;
