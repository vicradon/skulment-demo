import React from "react";
import TeacherDashboardLayout from "../../Layouts/TeacherDashboard";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/core";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import { TableStyles } from "../../Components/Styles";
import { getAssignedCourses } from "./functions";
import AssignedCoursesTable from "./AssignedCoursesTable";

const AssignedCourses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user_id, token} = useAuth0().user['https://fauna.com/user_metadata'];
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    getAssignedCourses(user_id, token)
      .then((courses) => {
        setLoading(false);
        setCourses(courses);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [token]);

  
  return (
    <TeacherDashboardLayout>
      <TableStyles />
      <Flex justify="space-between" align="center">
        <Heading size="lg" fontWeight="400">
          Assigned Courses
        </Heading>
      </Flex>
      {!loading ? <AssignedCoursesTable courses={courses} /> : <Loader />}
  
    </TeacherDashboardLayout>
  );
};

export default AssignedCourses;
