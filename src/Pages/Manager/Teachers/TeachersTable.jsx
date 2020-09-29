import { Box } from "@chakra-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { TableStyles } from "../../../Components/Styles";

const TeachersTable = ({ teachers }) => {
  const history = useHistory();
  return (
    <Box>
      <TableStyles />
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {teachers &&
            teachers.map((teacher, index) => {
              return (
                <tr
                  onClick={() => history.push(`/teachers/${teacher.id}`)}
                  key={teacher.id}
                >
                  <td>{index + 1}</td>
                  <td>{teacher.firstName}</td>
                  <td>{teacher.lastName}</td>
                  <td>{teacher.email}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Box>
  );
};

export default TeachersTable;
