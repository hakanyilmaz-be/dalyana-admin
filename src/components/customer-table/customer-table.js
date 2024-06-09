import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form } from "react-bootstrap";
import { db } from '../../../src/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import "./customer-table.css";

const CustomerTable = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const customers = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setRecords(customers);
        setFilteredRecords(customers);
      } catch (error) {
        console.error("Error fetching customers: ", error);
      }
    };

    fetchCustomers();
  }, []);

  const columns = [
    {
      name: "C. ID",
      selector: (row) => row.customerID,
      width: "100px",
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
      selector: (row) => row.city,
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
    navigate(`/clients/${row.id}`);
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = records.filter(row => {
      return (
        row.customerID.toLowerCase().includes(searchTerm) ||
        row.name.toLowerCase().includes(searchTerm) ||
        (row.phoneNumber && row.phoneNumber.toString().toLowerCase().includes(searchTerm)) ||
        row.email.toLowerCase().includes(searchTerm) ||
        row.city.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredRecords(filteredData);
  };

  return (
    <div className="data-wrapper">
      <div className="data-filter">
        <Form.Control size="lg" type="text" placeholder="Filtrer les données" onChange={handleFilter} />
      </div>
      {filteredRecords.length > 0 ?
        <DataTable
          columns={columns}
          data={filteredRecords}
          pagination
          fixedHeader
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          paginationComponentOptions={paginationOptions}
          onRowClicked={handleEdit}
        /> :
        <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
      }
    </div>
  );
};

export default CustomerTable;
