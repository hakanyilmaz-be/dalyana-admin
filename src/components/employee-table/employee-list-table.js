import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import './employee-list-table.css';
import defaultProfileImage from '../../assets/img/profile.png'; 

const EmployeeListTable = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]); // Filtrelenmiş veriler için ayrı bir state
    const [loading, setLoading] = useState(true);

    // Firestore'dan verileri çekmek için useEffect kullanın
    useEffect(() => {
        const fetchEmployees = async () => {
            const employeesCollection = collection(db, 'users');
            const employeeSnapshot = await getDocs(employeesCollection);
            const employeeList = employeeSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).filter(employee => employee.position !== "Developer"); // "Developer" pozisyonundaki kullanıcıları filtreleyin
            setRecords(employeeList);
            setFilteredRecords(employeeList); // İlk başta tüm verileri göster
            setLoading(false);
        };

        fetchEmployees();
    }, []);

    const columns = [
        {
            name: 'Profil',
            cell: (row) => (
                <img
                    src={row.imageUrl ? row.imageUrl : defaultProfileImage}
                    alt={row.name}
                    style={{ height: '50px', width: '50px', borderRadius: '5px', objectFit: 'cover' }}
                />
            ),
            width: '100px',
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
            grow: 1.5
        },
        {
            name: 'Emplacement',
            selector: (row) => row.location,
        },
        {
            name: 'Statut',
            selector: (row) => row.position,
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
        const searchText = e.target.value.toLowerCase();
        const filteredData = records.filter((row) => {
            return (
                row.name.toLowerCase().includes(searchText) ||
                row.phoneNumber.toLowerCase().includes(searchText) ||
                row.email.toLowerCase().includes(searchText) ||
                row.location.toLowerCase().includes(searchText) ||
                row.position.toLowerCase().includes(searchText)
            );
        });
        setFilteredRecords(filteredData); // Filtrelenmiş verileri güncelle
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
            {loading ? (
                <p>Chargement des données...</p>
            ) : filteredRecords.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={filteredRecords} // Filtrelenmiş verileri göster
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
