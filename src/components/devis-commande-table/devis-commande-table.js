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
    },
    {
      name: "Nom",
      selector: (row) => row.name,
    },
    {
      name: "Emplacement",
      selector: (row) => row.location,
    },
    {
      name: "Statut",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.firstDate,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        backgroundColor: "gray",
        color: "white",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  const handleEdit = (row) => {
    navigate(`/clients/${row.id}`);
  };

  const handleFilter = (e) => { 
      const filteredData = data.filter(row=>{
        return (
        row.id.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
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
        //  progressPending={loadingUsers}
        onRowClicked={handleEdit}
      /> :
      <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
      }
      
      

    </div>
  );
};

export default DevisCommandeTable;
