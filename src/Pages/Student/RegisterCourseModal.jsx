import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/core";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import React from "react";
import { selectComponentData, registerCourse } from "./functions";
import { useAuth0 } from "@auth0/auth0-react";

const RegisterCourseModal = ({ isOpen, onClose, addToCourses }) => {
  const [selected_course_id, setSelectedCourseId] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [registering, setRegistering] = React.useState(false);
  const { user } = useAuth0();

  const { user_id, token } = user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    selectComponentData(user_id, token)
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, []);

  const handleSubmit = (event) => {
    setRegistering(true);
    event.preventDefault();
    registerCourse(selected_course_id, user_id, token)
      .then((course) => {
        toast.success("added a courses");
        setRegistering(false);
        addToCourses(course);
        onClose();
      })
      .catch((error) => {
        setRegistering(false);
        toast.error(error.message);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Course</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="courses">Course to register</FormLabel>
              {!loading ? (
                <Select
                  value={selected_course_id}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                  name="courses"
                  id="courses"
                  placeholder="Select course"
                >
                  {courses &&
                    courses.map((course) => {
                      return (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      );
                    })}
                </Select>
              ) : (
                <Loader />
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={registering}
              loadingText="Registering"
              isDisabled={registering}
              type="submit"
              variantColor="blue"
              mr={3}
            >
              Register
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default RegisterCourseModal;
