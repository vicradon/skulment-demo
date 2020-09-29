import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import StudentDashboardLayout from "../../Layouts/StudentDashboard";
import InfoCard from "../../Components/InfoCard";
import coursesIcon from "../../assets/icons/books.svg";
import Loader from "../../Components/Loader";
import { capitalize } from "../../services/sharedFunctions";
import { courseCount as courseCounter } from "./functions";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useAuth0();
  const [courseCount, setCourseCount] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const { user_id, secret } = user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    courseCounter(user_id, secret)
      .then((count) => {
        setCourseCount(count);
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret, user_id]);

  return (
    <StudentDashboardLayout>
      <Box>
        <Heading color="typography.gray-1" size="2xl" fontWeight="450">
          Hi, {capitalize(user.nickname.split('.')[0])}
        </Heading>
        <Text color="typography.gray-1">Welcome Back</Text>

        <Text color="typography.gray-1">Secret: {secret}</Text>
      </Box>

      {!loading ? (
        <Flex my="2rem">
          <Box mr="2rem">
            <InfoCard title="Courses" value={courseCount}>
              <img src={coursesIcon} alt="" />
            </InfoCard>
          </Box>
        </Flex>
      ) : (
        <Loader />
      )}
    </StudentDashboardLayout>
  );
};

export default Home;
