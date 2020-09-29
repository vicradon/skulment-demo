import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import TeacherDashboardLayout from "../../Layouts/TeacherDashboard";
import InfoCard from "../../Components/InfoCard";
import studentsIcon from "../../assets/icons/students.svg";
import coursesIcon from "../../assets/icons/books.svg";
import Loader from "../../Components/Loader";
import { teacherDashboardDetails } from "./functions";
import { toast } from "react-toastify";
import { capitalize } from "../../services/sharedFunctions";

const Home = () => {
  const { user } = useAuth0();
  const { user_id, token } = user["https://fauna.com/user_metadata"];

  const [details, setDetails] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    teacherDashboardDetails(user_id, token)
      .then((details) => {
        setDetails(details)
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <TeacherDashboardLayout>
      <Box>
        <Heading color="typography.gray-1" size="2xl" fontWeight="450">
          Hi, {capitalize(user.nickname.split(".")[0])}
        </Heading>
        <Text color="typography.gray-1">Welcome Back</Text>
      </Box>

      {!loading ? (
        <Flex my="2rem">
          <Box mr="2rem">
            <InfoCard
              title="Students taking courses"
              value={details.student_count}
            >
              <img src={studentsIcon} alt="" />
            </InfoCard>
          </Box>
          <Box mr="2rem">
            <InfoCard title="Assigned Courses" value={details.course_count}>
              <img src={coursesIcon} alt="" />
            </InfoCard>
          </Box>
        </Flex>
      ) : (
        <Loader />
      )}
    </TeacherDashboardLayout>
  );
};

export default Home;
