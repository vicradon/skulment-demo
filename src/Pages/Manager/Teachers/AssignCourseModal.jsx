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
import Loader from "../../../Components/Loader.jsx";
import React from "react";
import { selectCourseComponentData, assignCourse } from "../functions";
import { useAuth0 } from "@auth0/auth0-react";

const AssignCourseModal = ({ isOpen, onClose, addToCourses, teacher_id }) => {
  const [selected_course_id, setSelectedCourseId] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [assigning, setAssigning] = React.useState(false);
  const { user } = useAuth0();

  const { secret } = user["https://fauna.com/user_metadata"];

  React.useEffect(() => {
    selectCourseComponentData(secret)
      .then((courses) => {
        setCourses(courses);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }, [secret]);

  const handleSubmit = (event) => {
    setAssigning(true);
    event.preventDefault();
    assignCourse(selected_course_id, teacher_id, secret)
      .then((course) => {
        toast.success("assigned course to teacher");
        setAssigning(false);
        addToCourses({ id: course.ref.id, title: course.data.title });
        onClose();
      })
      .catch((error) => {
        setAssigning(false);
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
              isLoading={assigning}
              loadingText="Assigning"
              isDisabled={assigning}
              type="submit"
              variantColor="blue"
              mr={3}
            >
              Assign
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AssignCourseModal;
