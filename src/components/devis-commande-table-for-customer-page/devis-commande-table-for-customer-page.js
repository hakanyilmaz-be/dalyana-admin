import React, { useState } from "react";
import data from "./devis-commande-table-for-customer-page.json";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form } from "react-bootstrap";
import "./devis-commande-table-for-customer-page.css"

const DevisCommandeTableForCustomerPage = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState(data)

  const columns = [
    {
      name: "P. ID",
      selector: (row) => row.id,
      width: "120px",
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
      name: "Date de Création",
      selector: (row) => row.createDate,
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
    navigate(`/projets/${row.id}`);
  };

  const handleFilter = (e) => { 
      const filteredData = data.filter(row=>{
        return (
        row.id.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.location.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.status.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) ||
        row.createDate.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()) )
        
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

export default DevisCommandeTableForCustomerPage;
