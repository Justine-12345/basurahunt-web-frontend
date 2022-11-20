import React, { useState, useEffect } from 'react'
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

function Table() {

  const columns = [
    { title: "Adı", field: "name" },
    { title: "Soyadı", field: "surname" },
    { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
    { title: "Role", field: "role" },
  ];

  const dataMain = [
    {
      id: 1,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "user"
    },
    {
      id: 2,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "admin"
    },
    {
      id: 3,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "user"
    },
    {
      id: 4,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "user"
    },
    {
      id: 5,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "user"
    },
    {
      id: 6,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "admin"
    },

    {
      id: 7,
      name: "Mehmet",
      surname: "Baran",
      birthYear: 1987,
      role: "user"
    },

  ]





  return (
    <div>
      <MaterialTable
        columns={columns}
        data={dataMain}
        title="Demo Title"
        options={{
                  exportMenu: [
                    {
                      label: "Export CSV",
                      //// You can do whatever you wish in this function. We provide the
                      //// raw table columns and table data for you to modify, if needed.
                      // exportFunc: (cols, datas) => console.log({ cols, datas })
                      exportFunc: (cols, datas) =>
                        ExportCsv(cols, dataMain, "reportData")
                    },
                    {
                      label: "Export PDF",
                      exportFunc: (cols, datas) =>
                      ExportPdf(cols, dataMain, "ApprovedRedPermits")
                    }
                  ],
                  search: true,
                  showTitle: true,
                  isLoading: true,

                  //exportDelimiter: '        ',
                  headerStyle: {
                    backgroundColor: "#01579b",
                    color: "#FFF"
                  }
                }}
      />
    </div>
  )
}

export default Table