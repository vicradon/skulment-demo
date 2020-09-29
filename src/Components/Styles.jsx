import { useTheme } from "@chakra-ui/core";
import React from "react";

export const TableStyles = () => {
  const blue300 = useTheme().colors.brand.blue["300"];
  return (
    <style>
      {`
      table {
          width: 100%;
          border-collapse: collapse;
          margin: 50px auto;
        }
        
        th {
        //   background: ${blue300};
        //   color: white;
          font-weight: bold;
        }
        
        td,
        th {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
          font-size: 18px;
        }
        
      `}
    </style>
  );
};
