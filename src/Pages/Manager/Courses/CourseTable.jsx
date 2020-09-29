import { Box } from "@chakra-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { TableStyles } from "../../../Components/Styles";

const CourseTable = ({ courses }) => {
  const history = useHistory();
  return (
    <Box>
      <TableStyles />
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Coure title</th>
            <th>Credit load</th>
            <th>Code</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {courses &&
            courses.map((course, index) => {
              return (
                <tr
                key={course.id}
                  onClick={() => history.push(`/courses/${course.id}`)}
                >
                  <td>{index + 1}</td>
                  <td>{course.title}</td>
                  <td>{course.creditLoad}</td>
                  <td>{course.code}</td>
                  <td>{course.availableFor}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Box>
  );
};

export default CourseTable;
