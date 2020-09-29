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
} from "@chakra-ui/core";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import React from "react";
import Loader from "../../Components/Loader";
import { selectComponentData, registerCourses } from "./functions";
import { useAuth0 } from "@auth0/auth0-react";

const RegisterCourseModal = ({
  isOpen,
  onClose,
  addToCourses,
  registeredCourses,
}) => {
  const [selected_courses, setSelectedCourses] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [registering, setRegistering] = React.useState(false);
  const { user } = useAuth0();

  const { user_id, secret } = user["https://fauna.com/user_metadata"];

  const transformCourseOptions = (courses) => {
    return courses.map((course) => {
      return {
        value: course.id,
        label: course.title,
      };
    });
  };

  const animatedComponents = makeAnimated();

  React.useEffect(() => {
    selectComponentData(user_id, secret)
      .then((data) => {
        const strigifiedRegisteredCourses = registeredCourses.map((course) =>
          JSON.stringify(course)
        );
        const registrableCourses = data.courses.filter((course) => {
          return !strigifiedRegisteredCourses.includes(JSON.stringify(course));
        });
        setCourses(transformCourseOptions(registrableCourses));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [user_id, secret, registeredCourses]);

  const handleSubmit = (event) => {
    setRegistering(true);
    event.preventDefault();
    /* TODO: Add registerCourses function below */

  };

  /* TODO: Add onChange handler here */


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register Courses</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="courses">Course to register</FormLabel>
              {!loading ? (
                // TODO: Remove the placeholder and add react-select
                <>placeholder</>

              ) : (
                <Loader />
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={registering}
              loadingText="Registering"
              isDisabled={
                registering ||
                courses.length === 0 ||
                selected_courses.length === 0
              }
              type="submit"
              variantColor="blue"
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
