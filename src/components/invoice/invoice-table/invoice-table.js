import React, { useState } from "react";
import data from "./invoices.json";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form } from "react-bootstrap";
import "./invoice-table.css"

const InvoiceTable = () => {
  const navigate = useNavigate(); 
  const [records, setRecords] = useState(data)

  const columns = [
    {
      name: "Numéro de facture",
      selector: (row) => row.id,
      width: "140px",
    },
    {
      name: "Client",
      selector: (row) => row.name,
    },
    {
      name: "Date de facture",
      selector: (row) => row.firstDate,
    },
    {
      name: "Type de facture",
      selector: (row) => row.type,
    },
   
  ];

  const paginationOptions = {
    rowsPerPageText: 'Nombre de lignes :',
    rangeSeparatorText: 'à',
    selectAllRowsItemText: 'Tout Afficher'
};

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "var(--color2)",
        color: "white",
      },
    },
    cells: {
      style: {
       // paddingLeft: "8px", // override the cell padding for data cells
       // paddingRight: "8px",
      },
    },
  };

  const handleEdit = (row) => {
    navigate(`/factures/${row.id}`);
  };

  const handleFilter = (e) => { 
      const filteredData = data.filter(row=>{
        return (
        row.id.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.type.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.firstDate.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) )
        
      })
      setRecords(filteredData);
   }

  return (
    <div className="data-wrapper">
      <div className="data-filter">
        <Form.Control size="lg" type="text" placeholder="Filtrer les données" onChange={handleFilter}/>
      </div>  
      {records.length > 0 ?
        <DataTable
        columns={columns}
        data={records}
        pagination
        fixedHeader
        customStyles={customStyles}
        highlightOnHover
		    pointerOnHover
        paginationComponentOptions={paginationOptions}

        //  progressPending={loadingUsers}
        onRowClicked={handleEdit}
      /> :
      <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
      }
      
    </div>
  );
};

export default InvoiceTable;
