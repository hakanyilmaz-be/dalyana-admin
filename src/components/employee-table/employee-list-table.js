import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import data from './employee-data.json';
import ProfileImage from './profile-image'; // Adjust this path if your file structure is different
import './employee-list-table.css';

const EmployeeListTable = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState(data);

    const columns = [
        {
            name: 'Profil',
            cell: (row) => <ProfileImage imageName={row.image.split('/').pop()} />,
            width: '100px',
        },
        {
            name: 'ID',
            selector: (row) => row.id,
            width: '80px',
        },
        {
            name: 'Nom',
            selector: (row) => row.name,
        },
        {
            name: 'Téléphone',
            selector: (row) => row.phoneNumber,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            width: '180px',
        },
        {
            name: 'Emplacement',
            selector: (row) => row.location,
        },
        {
            name: 'Statut',
            selector: (row) => row.status,
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
                minHeight: '60px', // override the row height
            },
        },
        headCells: {
            style: {
                backgroundColor: '#198754',
                color: 'white',
            },
        },
        cells: {
            style: {
                // paddingLeft: '8px', // override the cell padding for data cells
                // paddingRight: '8px',
            },
        },
    };

    const handleEdit = (row) => {
        navigate(`/employees/${row.id}`);
    };

    const handleFilter = (e) => {
        const filteredData = data.filter((row) => {
            return (
                row.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.phoneNumber.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.location.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.status.toLowerCase().includes(e.target.value.toLowerCase())
            );
        });
        setRecords(filteredData);
    };

    return (
        <div className="data-wrapper">
            <div className="data-filter">
                <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Filtrer les données"
                    onChange={handleFilter}
                />
            </div>
            {records.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={records}
                    pagination
                    fixedHeader
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
        paginationComponentOptions={paginationOptions}

                    onRowClicked={handleEdit}
                />
            ) : (
                <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
            )}
        </div>
    );
};

export default EmployeeListTable;
