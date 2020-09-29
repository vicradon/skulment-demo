// import {
//   Box,
//   Button,
//   Flex,
//   FormControl,
//   FormLabel,
//   Input,
//   ModalBody,
//   ModalFooter,
//   Select,
//   Text,
// } from "@chakra-ui/core";
// import { toast } from "react-toastify";
// import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import GenericModal from "../../../Components/GenericModal";
// import { addTeacher } from "../functions";

// const AddTeacherModal = ({ isOpen, onClose, addToTeachers }) => {
//   const [state, setState] = React.useState({
//     firstName: "Shoke",
//     lastName: "Mariam",
//     email: "shonke.mariam@skulment.edu",
//   });

//   const [courses, setCourses] = React.useState([]);
//   const [selectedCourses, setSelectedCourses] = React.useState([]);

//   const handleChange = ({ target }) => {
//     setState({ ...state, [target.name]: target.value });
//   };
//   const [loading, setLoading] = React.useState(false);

//   const { secret } = useAuth0().user["https://fauna.com/user_metadata"];

//   React.useEffect(() => {}, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     addTeacher(secret, state)
//       .then((data) => {
//         toast.success("A new teacher added to your school!");
//         addToTeachers({
//           id: data.id,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//         });
//         onClose();
//       })
//       .catch((error) => {
//         toast.error(error.message);
//       });
//   };

//   const handleSelectChange = (event) => {
//     setCourses(courses.filter((course) => course.id !== event.target.value));
//     setSelectedCourses([...selectedCourses, event.target.value]);
//   };
//   return (
//     <GenericModal title="Add teacher" isOpen={isOpen} onClose={onClose}>
//       <form onSubmit={handleSubmit}>
//         <ModalBody pb={6}>
//           <FormControl isRequired>
//             <FormLabel htmlFor="firstName">First name</FormLabel>
//             <Input
//               id="firstName"
//               value={state.firstName}
//               name="firstName"
//               onChange={handleChange}
//               aria-describedby="First name"
//               placeholder="John"
//             />
//           </FormControl>
//           <FormControl isRequired mt={4}>
//             <FormLabel htmlFor="lastName">Last name</FormLabel>
//             <Input
//               id="lastName"
//               value={state.lastName}
//               name="lastName"
//               onChange={handleChange}
//               aria-describedby="Last name"
//               placeholder="Doe"
//             />
//           </FormControl>
//           <FormControl isRequired mt={4}>
//             <FormLabel htmlFor="email">Teacher email</FormLabel>
//             <Input
//               id="email"
//               value={state.email}
//               name="email"
//               onChange={handleChange}
//               aria-describedby="Teacher email"
//               placeholder="doe.john@skulment.edu"
//             />
//           </FormControl>
//           <Box>
//             {state.selectedCourse &&
//               state.selectedCourse.map((course) => {
//                 return <Text key={course.id}>{course.title}</Text>;
//               })}
//           </Box>
//           <FormControl mt={4}>
//             <FormLabel htmlFor="courses">Courses</FormLabel>
//             <Select
//               id="courses"
//               name="courses"
//               value={state.selectedCourse}
//               onChange={handleSelectChange}
//               aria-describedby="courses"
//               placeholder="Select course"
//             >
//               {courses &&
//                 courses.map((course) => {
//                   return <option value={course.id} key={course.id}>{course.title}</option>;
//                 })}
//             </Select>
//           </FormControl>
//         </ModalBody>

//         <ModalFooter>
//           <Button type="submit" variantColor="blue">
//             Add
//           </Button>
//         </ModalFooter>
//       </form>
//     </GenericModal>
//   );
// };

// export default AddTeacherModal;
