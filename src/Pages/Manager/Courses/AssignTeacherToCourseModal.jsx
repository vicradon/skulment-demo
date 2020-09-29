import { useAuth0 } from "@auth0/auth0-react";
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
  Input,
  Select,
} from "@chakra-ui/core";
import React from "react";
import { toast } from "react-toastify";
import { addCourse } from "../functions";

const AssignTeacherToCourseModal = ({
  isOpen,
  onClose,
  addToTeachers,
  course_id,
}) => {
  const {token} = useAuth0().user["https://fauna.com/user_metadata"];
  const [state, setState] = React.useState({
    title: "General Mathematics",
    description: "A course on a few principles",
    teachers: "Random tutor",
    code: "MTH 411",
    class: "grade 9",
    creditLoad: 3,
  });
  const [loading, setLoading] = React.useState(false);
  const handleChange = ({ target }) => {
    setState({ ...state, [target.name]: target.value });
  };
  const handleAssignment = (event) => {
    event.preventDefault();
    addCourse(token, state)
      .then(() => {
        toast.success("Added a course");
        addToTeachers([state.title, state.creditLoad, state.class]);
        onClose();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Teacher to course</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleAssignment}>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor="assigned-class">Class</FormLabel>
              <Select
                value={state.class}
                onChange={handleChange}
                name="class"
                id="assigned-class"
                placeholder="Select class"
              >
                {Array(6)
                  .fill(1)
                  .map((_, index) => {
                    return (
                      <option value={`grade ${index + 7}`} key={index}>
                        Grade {index + 7}
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText="Assigning..."
              color="white"
              bg="brand.blue.800"
              type="submit"
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

export default AssignTeacherToCourseModal;
