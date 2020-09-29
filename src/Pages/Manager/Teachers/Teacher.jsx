import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import React from "react";
import { toast } from "react-toastify";
import Loader from "../../../Components/Loader";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import { getTeacherDetails } from "../functions";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import AssignCourseModal from "./AssignCourseModal";

const Teacher = () => {
  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure();

  const teacher_id = window.location.pathname.split("/").reverse()[0];
  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];
  const [teacher, setTeacher] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const addToCourses = (course) => {
    setCourses([...courses, course]);
  };

  React.useEffect(() => {
    getTeacherDetails(teacher_id, secret)
      .then((teacher) => {
        setTeacher(teacher);
        setCourses(teacher.courses);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [teacher_id, secret]);

  return (
    <ManagerDashboardLayout>
      <Flex align="center">
        <Box mr=".5rem" as={HiArrowNarrowLeft} />
        <Link to="/teachers">Back to teachers</Link>
      </Flex>
      {!loading ? (
        <Box mt="2rem">
          <Heading size="xl" fontWeight="500">
            {`${teacher.firstName} ${teacher.lastName}`}
          </Heading>

          <Flex my="1rem" align="center">
            <Box mr="3rem">
              <Text>Email</Text>
              <Heading fontWeight={400} size="md">
                {teacher.email}
              </Heading>
            </Box>
          </Flex>

          <Box my="3rem">
            <Flex justify="space-between" align="center">
              <Heading size="lg" fontWeight="400">
                Courses
              </Heading>
              <Button onClick={onAssignOpen} variantColor="blue" ml="2rem">
                Assign course
              </Button>
            </Flex>

            <List as="ol" styleType="decimal">
              {courses &&
                courses.map((course) => {
                  return <ListItem key={course.id}>{course.title}</ListItem>;
                })}
            </List>
            {courses.length && courses.length === 0 && "No courses"}
          </Box>
        </Box>
      ) : (
        <Loader />
      )}
      <AssignCourseModal
        isOpen={isAssignOpen}
        onClose={onAssignClose}
        addToCourses={addToCourses}
        teacher_id={teacher_id}
      />
    </ManagerDashboardLayout>
  );
};

export default Teacher;
