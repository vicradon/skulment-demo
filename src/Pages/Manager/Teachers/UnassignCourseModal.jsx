import { Button, Flex } from "@chakra-ui/core";
import { toast } from "react-toastify";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import GenericModal from "../../../Components/GenericModal";
import { unAssginCourse } from "../functions";
import { useHistory } from "react-router-dom";

const UnassignCourseModal = ({ isOpen, onClose, course_id, teacher_id }) => {
  const history = useHistory();
  const token = useAuth0().user["https://fauna.com/user_metadata"].token;
  const [loading, setLoading] = React.useState(false);

  const handleUnassign = () => {
    setLoading(true);
    unAssginCourse(course_id, teacher_id, token)
      .then(() => {
        setLoading(false);
        toast.success("teacher unassigned successfully");
        history.push("/teachers");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <GenericModal title="Unregister course?" isOpen={isOpen} onClose={onClose}>
      <Flex justify="space-around">
        <Button
          isLoading={loading}
          loadingText="Unassigning..."
          onClick={handleUnassign}
          variantColor="brand.red.800"
          bg="brand.red.800"
        >
          Unassign
        </Button>
        <Button
          onClick={onClose}
          variantColor="brand.blue.800"
          bg="brand.blue.800"
        >
          Cancel
        </Button>
      </Flex>
    </GenericModal>
  );
};

export default UnassignCourseModal;
