import { Button, Flex } from "@chakra-ui/core";
import { toast } from "react-toastify";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import GenericModal from "../../Components/GenericModal";
import { unregisterCourse } from "./functions";
import { useHistory } from "react-router-dom";

const UnregisterCourseModal = ({ isOpen, onClose, course_id }) => {
  const history = useHistory();
  const { user } = useAuth0();
  const [loading, setLoading] = React.useState(false);
  const { user_id, secret } = user["https://fauna.com/user_metadata"];

  const handleUnregisteration = () => {
    setLoading(true);
    unregisterCourse(course_id, user_id, secret)
      .then(() => {
        setLoading(false);
        toast.success("course unregistered successfully");
        history.push("/courses");
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
          loadingText="Unregistering..."
          onClick={handleUnregisteration}
          variantColor="red"
        >
          Unregister
        </Button>
        <Button
          onClick={onClose}
          variantColor="blue"
        >
          Cancel
        </Button>
      </Flex>
    </GenericModal>
  );
};

export default UnregisterCourseModal;
