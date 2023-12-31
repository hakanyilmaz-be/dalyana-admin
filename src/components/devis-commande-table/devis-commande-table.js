import React, { useState } from "react";
import data from "./devis-commande.json";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form } from "react-bootstrap";
import "./devis-commande-table.css"

const DevisCommandeTable = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState(data)

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "80px",
    },
    {
      name: "Nom",
      selector: (row) => row.name,
    },
    {
      name: "Téléphone",
      selector: (row) => row.phoneNumber,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Emplacement",
      selector: (row) => row.location,
    },
    {
      name: "Statut",
      selector: (row) => row.status,
    },
    {
      name: "Date",
      selector: (row) => row.firstDate,
    },
  ];

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
    navigate(`/projets-clients/${row.id}`);
  };

  const handleFilter = (e) => { 
      const filteredData = data.filter(row=>{
        return (
        row.id.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.phoneNumber.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.email.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.location.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.status.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
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
        //  progressPending={loadingUsers}
        onRowClicked={handleEdit}
      /> :
      <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
      }
      
    </div>
  );
};

export default DevisCommandeTable;
