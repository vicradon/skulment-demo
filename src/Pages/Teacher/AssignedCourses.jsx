import React from "react";
import TeacherDashboardLayout from "../../Layouts/TeacherDashboard";
import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Heading } from "@chakra-ui/core";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import { TableStyles } from "../../Components/Styles";
import { getAssignedCourses } from "./functions";
import AssignedCoursesTable from "./AssignedCoursesTable";

const AssignedCourses = () => {
  const {user_id, secret} = useAuth0().user['https://fauna.com/user_metadata'];
  const [loading, setLoading] = React.useState(true);
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    getAssignedCourses(user_id, secret)
      .then((courses) => {
        setLoading(false);
        setCourses(courses);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [user_id, secret]);

  
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
