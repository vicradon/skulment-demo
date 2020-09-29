import {
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Box,
} from "@chakra-ui/core";
import React from "react";
import ManagerDashboardLayout from "../../../Layouts/ManagerDashboard";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";
import { addCourse, fetchCourseAdditionDependencies } from "../functions";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useHistory } from "react-router-dom";

const AddCourse = () => {
  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();
  const [state, setState] = React.useState({
    title: "General Mathematics",
    teacher: "",
    description: "A course on the beauty of Math",
    code: "MTH 411",
    availableFor: "",
    creditLoad: 3,
  });

  const [teachers, setTeachers] = React.useState([]);
  const [classes, setClasses] = React.useState([]);

  React.useEffect(() => {
    setLoading(false);

    fetchCourseAdditionDependencies(secret)
      .then((data) => {
        setTeachers(data.teachers);
        setClasses(data.classes);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret]);

  const handleChange = ({ target }) => {
    setState({ ...state, [target.name]: target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    addCourse(state, secret)
      .then(() => {
        toast.success("Added a course");
        history.push("/courses");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <ManagerDashboardLayout>
      <Flex align="center">
        <Box mr=".5rem" as={HiArrowNarrowLeft} />
        <Link to="/courses">Back to courses</Link>
      </Flex>
      <Box mt={4}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor="title">Course title</FormLabel>
            <Input
              id="title"
              value={state.title}
              name="title"
              onChange={handleChange}
              aria-describedby="Course title"
              placeholder="General Mathematics"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="code">Course code</FormLabel>
            <Input
              id="code"
              name="code"
              value={state.code}
              onChange={handleChange}
              aria-describedby="Course code"
              placeholder="MTH 423"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="description">Course description</FormLabel>
            <Input
              id="description"
              name="description"
              value={state.description}
              onChange={handleChange}
              aria-describedby="Course description"
              placeholder="A course on a few principles"
            />
          </FormControl>
          {!loading && (
            <FormControl mt={4}>
              <FormLabel htmlFor="availableFor">Class</FormLabel>
              <Select
                value={state.availableFor}
                onChange={handleChange}
                name="availableFor"
                id="availableFor"
                placeholder="Select class"
              >
                {classes &&
                  classes.map((classObj) => {
                    return (
                      <option value={classObj.id} key={classObj.id}>
                        {classObj.name}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
          )}
          <FormControl mt={4}>
            <FormLabel htmlFor="creditLoad">Credit load</FormLabel>
            <Select
              value={state.creditLoad}
              onChange={handleChange}
              name="creditLoad"
              id="creditLoad"
              placeholder="Select credit load"
            >
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  return (
                    <option value={index + 1} key={index}>
                      {index + 1}
                    </option>
                  );
                })}
            </Select>
          </FormControl>

          {!loading && (
            <FormControl mt={4}>
              <FormLabel htmlFor="teacher">Assigned Teachers</FormLabel>
              <Select
                value={state.teacher}
                onChange={handleChange}
                id="teacher"
                name="teacher"
                aria-describedby="Assigned teacher"
                placeholder="Select teacher"
              >
                {teachers &&
                  teachers.map((teacher) => {
                    return (
                      <option value={teacher.id} key={teacher.id}>
                        {teacher.name}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
          )}

          <ModalFooter>
            <Button isDisabled={loading} type="submit" variantColor="blue">
              Create
            </Button>
          </ModalFooter>
        </form>
      </Box>
    </ManagerDashboardLayout>
  );
};

export default AddCourse;
