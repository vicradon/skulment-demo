// import { useAuth0 } from "@auth0/auth0-react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
// } from "@chakra-ui/core";
// import React from "react";
// import { toast } from "react-toastify";
// import { addStudent } from "../functions";

// const AddStudentModal = ({ isOpen, onClose, addToStudents }) => {
//   const token = useAuth0().user["https://fauna.com/user_metadata"].token;
//   const [state, setState] = React.useState({
//     firstName: "Mathos",
//     lastName: "Erros",
//     email: "mathos.erros@skulment.edu",
//     currentClass: "grade 8",
//   });
//   const handleChange = ({ target }) => {
//     setState({ ...state, [target.name]: target.value });
//   };
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     addStudent(token, state)
//       .then((data) => {
//         toast.success("Added a student");
//         addToStudents({
//           id: data.id,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           currentClass: data.currentClass,
//           courseCount: data.courseCount || 0,
//         });
//         onClose();
//       })
//       .catch((error) => {
//         toast.error(error.message);
//       });
//   };
//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Add Student</ModalHeader>
//         <ModalCloseButton />
//         <form onSubmit={handleSubmit}>
//           <ModalBody pb={6}>
//             <FormControl isRequired>
//               <FormLabel htmlFor="firstName">First name</FormLabel>
//               <Input
//                 id="firstName"
//                 value={state.firstName}
//                 name="firstName"
//                 onChange={handleChange}
//                 aria-describedby="first name"
//                 placeholder="Mathos"
//               />
//             </FormControl>
//             <FormControl isRequired mt={4}>
//               <FormLabel htmlFor="lastName">Last name</FormLabel>
//               <Input
//                 id="lastName"
//                 value={state.lastName}
//                 name="lastName"
//                 onChange={handleChange}
//                 aria-describedby="last name"
//                 placeholder="Erros"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <Input
//                 id="email"
//                 name="email"
//                 value={state.email}
//                 onChange={handleChange}
//                 aria-describedby="Email"
//                 placeholder="mathos.erros@skulment.edu"
//               />
//             </FormControl>
//             <FormControl mt={4}>
//               <FormLabel htmlFor="currentClass">Class</FormLabel>
//               <Select
//                 id="currentClass"
//                 name="currentClass"
//                 value={state.currentClass}
//                 onChange={handleChange}
//                 aria-describedby="Student's current class"
//                 placeholder="Select student current class"
//               >
//                 {Array(6)
//                   .fill(1)
//                   .map((_, index) => {
//                     return (
//                       <option value={`grade ${index + 7}`} key={index}>
//                         Grade {index + 7}
//                       </option>
//                     );
//                   })}
//               </Select>
//             </FormControl>
//           </ModalBody>

//           <ModalFooter>
//             <Button type="submit" variantColor="blue" bg="brand.blue.800">
//               Add
//             </Button>
//           </ModalFooter>
//         </form>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default AddStudentModal;
