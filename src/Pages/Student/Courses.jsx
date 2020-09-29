import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import StudentDashboardLayout from "../../Layouts/StudentDashboard";
import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/core";
import Loader from "../../Components/Loader";
import { TableStyles } from "../../Components/Styles";
import RegisterCourseModal from "./RegisterCourseModal";
import RegisteredCoursesTable from "./RegisteredCoursesTable";
import { getRegisteredCourses } from "./functions";
import { toast } from "react-toastify";

const Courses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);

  const { user_id, token } = useAuth0().user["https://fauna.com/user_metadata"];

  const addToCourses = (course) => {
    setCourses([...courses, course]);
  };

  React.useEffect(() => {
    getRegisteredCourses(user_id, token)
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, []);

  return (
    <StudentDashboardLayout>
      <TableStyles />
      <Flex justify="space-between" align="center">
        <Heading size="lg" fontWeight="400">
          Your Courses
        </Heading>
        <Button
          variant="solid"
          color="white"
          bg="brand.blue.800"
          variantColor="brand.blue.800"
          onClick={onOpen}
        >
          Register Course
        </Button>
      </Flex>
      {!loading ? <RegisteredCoursesTable courses={courses} /> : <Loader />}

      <RegisterCourseModal
        addToCourses={addToCourses}
        isOpen={isOpen}
        onClose={onClose}
      />
    </StudentDashboardLayout>
  );
};

export default Courses;
