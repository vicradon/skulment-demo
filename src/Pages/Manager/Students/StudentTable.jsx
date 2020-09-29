import { Box } from "@chakra-ui/core";
import React from "react";
import { TableStyles } from "../../../Components/Styles";

const CourseTable = ({ students }) => {
  return (
    <Box>
      <TableStyles />
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Class</th>
            <th>Course count</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student, index) => {
              return (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.currentClass}</td>
                  <td>{student.courseCount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Box>
  );
};

export default CourseTable;
