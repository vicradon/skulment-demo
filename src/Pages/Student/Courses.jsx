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

  const { user_id, secret } = useAuth0().user[
    "https://fauna.com/user_metadata"
  ];

  const addToCourses = (newCourses) => {
    setCourses([...courses, ...newCourses]);
  };

  React.useEffect(() => {
    getRegisteredCourses(user_id, secret)
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret, user_id]);

  return (
    <StudentDashboardLayout>
      <TableStyles />
      <Flex justify="space-between" align="center">
        <Heading size="lg" fontWeight="400">
          Your Courses
        </Heading>
        <Button color="white" variantColor="blue" onClick={onOpen}>
          Register Course
        </Button>
      </Flex>
      {!loading ? <RegisteredCoursesTable courses={courses} /> : <Loader />}

      {!loading && (
        <RegisterCourseModal
          registeredCourses={courses.map((course) => ({
            id: course.ref.id,
            title: course.data.title,
          }))}
          addToCourses={addToCourses}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </StudentDashboardLayout>
  );
};

export default Courses;
