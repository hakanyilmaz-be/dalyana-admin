import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import accessoires from './data/accessoires.json';
import divers from './data/divers.json'
import electromenagers from './data/electromenagers.json'
import sanitaires from './data/sanitaires.json'
import surfaces from './data/surfaces.json'
import mobilier from './data/mobilier.json'
import './stock-list-table.css';
import { HiPencilSquare } from "react-icons/hi2";
import { AiTwotoneDelete } from 'react-icons/ai';

const StockListTable = () => {
    // Merge all data into a single array
    const allData = [...mobilier, ...accessoires, ...divers, ...electromenagers, ...sanitaires, ...surfaces];
    const [searchText, setSearchText] = useState("");
    const [records, setRecords] = useState(allData);

 

useEffect(() => {
  const arr = allData.filter((item)=>
    item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
    item.label.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
    item.value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
    item.note.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
    item.quantity.toString().includes(searchText)
  );
  setRecords(arr);
}, [searchText]);




    return (
      <div className="stock-list-table-wrapper">
      

        <div className="data-filter">
          <Form.Control
            size="lg"
            className="my-3"
            type="search"
            placeholder="Filtrer..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {records.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name-Reference</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Note</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item, id) => (
                <tr key={id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category}</td>
                  <td>{item.note}</td>
                  <td>
                    <Button variant="outline-success">
                      <HiPencilSquare />
                    </Button>
                  </td>
                  <td>
                    <Button variant="outline-danger">
                      <AiTwotoneDelete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="filtered-message">
            Il n'y a aucun enregistrement à afficher
          </p>
        )}
      </div>
    );
};

export default StockListTable;
