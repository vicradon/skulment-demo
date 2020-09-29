import { Button, Flex } from "@chakra-ui/core";
import { toast } from "react-toastify";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import GenericModal from "../../../Components/GenericModal";
import { deleteCourse } from "../functions";
import { useHistory } from "react-router-dom";

const DeleteCourseModal = ({ isOpen, onClose, course_id }) => {
  const history = useHistory();
  const { secret } = useAuth0().user["https://fauna.com/user_metadata"];
  const [loading, setLoading] = React.useState(false);

  const handleDelete = () => {
    setLoading(true);
    deleteCourse(course_id, secret)
      .then(() => {
        setLoading(false);
        toast.success("successfully deleted course");
        history.push('/courses');
      })
      .catch((error) => {
        console.error(error)
        setLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <GenericModal title="Delete course?" isOpen={isOpen} onClose={onClose}>
      <Flex justify="space-around">
        <Button
          isLoading={loading}
          loadingText="Deleting..."
          onClick={handleDelete}
          variantColor="red"
        >
          Yes, delete
        </Button>
        <Button onClick={onClose} variantColor="blue" bg="brand.blue.800">
          Cancel
        </Button>
      </Flex>
    </GenericModal>
  );
};

export default DeleteCourseModal;
