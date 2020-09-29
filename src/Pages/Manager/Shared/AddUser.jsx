import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Box,
} from "@chakra-ui/core";
import React from "react";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import { addUser } from "../functions";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useHistory } from "react-router-dom";

const AddUser = (props) => {
  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];
  const role = props.location.state.role;
  const history = useHistory();
  const [user, setUser] = React.useState({
    firstName: "Mathos",
    lastName: "Erros",
    email: "mathos.erros@skulment.edu",
  });

  const handleChange = ({ target }) => {
    setUser({ ...user, [target.name]: target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    addUser(user, role, secret)
      .then(() => {
        toast.success("Added a user");
        history.push(`/${role}s`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <ManagerDashboardLayout>
      <Flex align="center">
        <Box mr=".5rem" as={HiArrowNarrowLeft} />
        <Link to={`${role}s`}>Back to {`${role}s`}</Link>
      </Flex>
      <Box mt={4}>
        <form onSubmit={handleSubmit}>
          <Box>
            <FormControl isRequired>
              <FormLabel htmlFor="firstName">First name</FormLabel>
              <Input
                id="firstName"
                value={user.firstName}
                name="firstName"
                onChange={handleChange}
                aria-describedby="first name"
                placeholder="Mathos"
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel htmlFor="lastName">Last name</FormLabel>
              <Input
                id="lastName"
                value={user.lastName}
                name="lastName"
                onChange={handleChange}
                aria-describedby="last name"
                placeholder="Erros"
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                aria-describedby="Email"
                placeholder="mathos.erros@skulment.edu"
              />
            </FormControl>
          </Box>

          <Box mt={4}>
            <Button type="submit" variantColor="blue">
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </ManagerDashboardLayout>
  );
};

export default AddUser;
