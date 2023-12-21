import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Form } from 'react-bootstrap';
import accessoires from '../../assets/data/accessoires.json';
import divers from '../../assets/data/divers.json'
import electromenagers from '../../assets/data/electromenagers.json'
import sanitaires from '../../assets/data/sanitaires.json'
import surfaces from '../../assets/data/surfaces.json'
import './element-list-table.css';

const ElementListTable = () => {
   
 
    // Merge all data into a single array
    const allData = [...accessoires, ...divers, ...electromenagers, ...sanitaires, ...surfaces];
    const [records, setRecords] = useState(allData);

    const columns = [
      
        {
            name: 'ID',
            selector: (row) => row.id,
            width: '80px',
        },
        {
            name: 'Nom-Modèle',
            selector: (row) => row.label,
            width: '140px',
            
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            width: '580px',
        },
        {
            name: 'Price',
            selector: (row) => `${row.price} €`,
            
            
        },
      
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '60px', // override the row height
            },
        },
        headCells: {
            style: {
                backgroundColor: '#d01225',
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


    const handleFilter = (e) => {
        const filteredData = allData.filter((row) => {
            return (
                row.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.label.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
                row.price.toLowerCase().includes(e.target.value.toLowerCase())
            );
        });
        setRecords(filteredData);
    };

    return (
        <div className="element-list-table-wrapper">
            <div className="data-filter">
                <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Filtrer..."
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
                    className="my-custom-table"
                />
            ) : (
                <p className="filtered-message">Il n'y a aucun enregistrement à afficher</p>
            )}
        </div>
    );
};

export default ElementListTable;
