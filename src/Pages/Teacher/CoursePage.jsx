import { Box, Flex, Heading, List, ListItem, Text } from "@chakra-ui/core";
import React from "react";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import StudentDashboardLayout from "../../Layouts/StudentDashboard";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { getCoursePageData } from "../Shared/functions";

const CoursePage = () => {
  const course_id = window.location.pathname.split("/").reverse()[0];
  const secret = useAuth0().user["https://fauna.com/user_metadata"].secret;
  const [details, setDetails] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCoursePageData(course_id, secret)
      .then((details) => {
        setDetails(details);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [course_id, secret]);

  return (
    <StudentDashboardLayout>
      <Flex align="center">
        <Box mr="1rem" as={HiArrowNarrowLeft} />
        <Link to="/courses">Back to courses</Link>
      </Flex>
      {!loading ? (
        <Box mt="2rem">
          <Heading size="xl" fontWeight="500">
            {details.title}
          </Heading>
          <Flex my="3rem" align="center">
            <Box mr="3rem">
              <Text>Credit Load</Text>
              <Heading fontWeight={400} size="md">
                {details.creditLoad}
              </Heading>
            </Box>
            <Box mr="1rem">
              <Text>Course Code</Text>
              <Heading fontWeight={400} size="md">
                {details.code}
              </Heading>
            </Box>
          </Flex>
          <Box my="3rem">
            <Flex align="center">
              <Heading size="md" fontWeight="400">
                Students
              </Heading>
            </Flex>

            <List as="ol" styleType="decimal">
              {(details.students &&
                details.students.map((teacher) => {
                  return <ListItem key={teacher.id}>{teacher.name}</ListItem>;
                })) ||
                "No students"}
            </List>
          </Box>
          <Box my="3rem">
            <Flex align="center">
              <Heading size="md" fontWeight="400">
                Teachers
              </Heading>
            </Flex>

            <List as="ol" styleType="decimal">
              {details.teachers &&
                details.teachers.map((teacher) => {
                  return <ListItem key={teacher.id}>{teacher.name}</ListItem>;
                })}
            </List>
            {details.teachers && details.teachers.length === 0 && "No teachers"}
          </Box>
        </Box>
      ) : (
        <Loader />
      )}
    </StudentDashboardLayout>
  );
};

export default CoursePage;
