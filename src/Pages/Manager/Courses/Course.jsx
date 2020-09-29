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
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import DeleteCourseModal from "./DeleteCourseModal";
import { getCoursePageData } from "../../Shared/functions";

const Course = () => {
  const course_id = window.location.pathname.split("/").reverse()[0];

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];
  const [course, setCourse] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCoursePageData(course_id, secret)
      .then((course) => {
        setCourse(course);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }, [course_id, secret]);

  return (
    <ManagerDashboardLayout>
      <Flex align="center">
        <Box mr=".5rem" as={HiArrowNarrowLeft} />
        <Link to="/courses">Back to courses</Link>
      </Flex>
      {!loading ? (
        <Box mt="2rem">
          <Heading size="lg" fontWeight="400">
            {course.title}
          </Heading>

          <Flex my="1rem" align="center">
            <Box mr="3rem">
              <Text>Credit load</Text>
              <Heading fontWeight={400} size="md">
                {course.creditLoad}
              </Heading>
            </Box>
            <Box mr="3rem">
              <Text>Course Code</Text>
              <Heading fontWeight={400} size="md">
                {course.code}
              </Heading>
            </Box>
            <Box mr="3rem">
              <Text>Available for</Text>
              <Heading fontWeight={400} size="md">
                {course.availableFor}
              </Heading>
            </Box>
          </Flex>

          <Box my="3rem">
            <Heading size="md" fontWeight="400">
              Teachers
            </Heading>

            <List as="ol" styleType="decimal">
              {course.teachers &&
                course.teachers.map((teacher) => {
                  return <ListItem key={teacher.id}>{teacher.name}</ListItem>;
                })}
            </List>
            {course.teachers && course.teachers.length === 0 && "No teachers"}
          </Box>
          <Box my="3rem">
            <Heading size="md" fontWeight="400">
              Enrolment count:{" "}
              {(course.registrations && course.registrations.length) || 0}
            </Heading>
          </Box>

          <Flex justify="flex-end">
            <Button variantColor="red" onClick={onDeleteOpen}>
              Delete
            </Button>
          </Flex>
        </Box>
      ) : (
        <Loader />
      )}

      <DeleteCourseModal
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        course_id={course_id}
      />
    </ManagerDashboardLayout>
  );
};

export default Course;
