import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import ManagerDashboardLayout from "../../Layouts/ManagerDashboard";
import InfoCard from "../../Components/InfoCard";
import Loader from "../../Components/Loader";
import { studentTeacherCourseCount } from "./functions";
import { toast } from "react-toastify";
import studentsIcon from "../../assets/icons/students.svg";
import teachersIcon from "../../assets/icons/teacher.svg";
import coursesIcon from "../../assets/icons/books.svg";
import { capitalize } from "../../services/sharedFunctions";

const Home = () => {
  const { user } = useAuth0();
  const {secret} = user["https://fauna.com/user_metadata"];
  const [collectionCount, setCollectionCount] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    studentTeacherCourseCount(secret)
      .then((count) => {
        setCollectionCount(count);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret]);

  return (
    <ManagerDashboardLayout>
      <Box>
        <Heading color="typography.gray-1" size="2xl" fontWeight="450">
          Hi, {capitalize(user.nickname.split(".")[0])}
        </Heading>
        <Text color="typography.gray-1">Time to manage more!</Text>
      </Box>

      {!loading ? (
        <Flex my="2rem">
          <Box mr="2rem">
            <InfoCard title="Students" value={collectionCount.student_count}>
              <img src={studentsIcon} alt="" />
            </InfoCard>
          </Box>
          <Box mr="2rem">
            <InfoCard title="Teachers" value={collectionCount.teacher_count}>
              <img src={teachersIcon} alt="" />
            </InfoCard>
          </Box>
          <Box mr="2rem">
            <InfoCard title="Courses" value={collectionCount.course_count}>
              <img src={coursesIcon} alt="" />
            </InfoCard>
          </Box>
        </Flex>
      ) : (
        <Loader />
      )}
    </ManagerDashboardLayout>
  );
};

export default Home;
