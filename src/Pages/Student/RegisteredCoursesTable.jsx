import { Box } from "@chakra-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { TableStyles } from "../../Components/Styles.jsx";

const RegisteredCoursesTable = ({ courses }) => {
  const history = useHistory();
  return (
    <Box>
      <TableStyles />
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Title</th>
            <th>Code</th>
            <th>Credit load</th>
          </tr>
        </thead>
        <tbody>
          {courses &&
            courses.map((course, index) => {
              return (
                <tr
                  /* TODO: Add an onClick handler here */
                  onClick={() => history.push(`/courses/${course.ref.id}`)}
                  key={index}
                >
                  <td>{index + 1}</td>
                  <td>{course.data.title}</td>
                  <td>{course.data.code}</td>
                  <td>{course.data.creditLoad}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Box>
  );
};

export default RegisteredCoursesTable;
