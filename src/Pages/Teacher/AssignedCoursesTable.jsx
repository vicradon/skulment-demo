import { Box } from "@chakra-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { TableStyles } from "../../Components/Styles.jsx";

const AssignedCoursesTable = ({ courses }) => {
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
            <th>Registeration count</th>
          </tr>
        </thead>
        <tbody>
          {courses &&
            courses.map((course, index) => {
              return (
                <tr
                  onClick={() => history.push(`/courses/${course.id}`)}
                  key={index}
                >
                  <td>{index + 1}</td>
                  <td>{course.title}</td>
                  <td>{course.code}</td>
                  <td>{course.student_count}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Box>
  );
};

export default AssignedCoursesTable;
