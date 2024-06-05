import React from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import "./status.css";

const Status = ({ setFilterStatus }) => {
  return (
    <> 
      <div className="status-wrapper">
        <h2 className="status-title">Tous Les Statuts</h2>
    <div className="title-border mt-3 mb-5"></div> 

        <div className="status-options">
          <ButtonGroup className="mr-2">
            <Button variant="success" onClick={() => setFilterStatus('Devis')}>Devis</Button>
          </ButtonGroup>

          <MdOutlineArrowForwardIos />

          <ButtonGroup className="mr-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Bon de Commande
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus('Bon de Commande')}>Bon de Commande</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus('Bon de Commande Modifié')}>Bon de Commande Modifié</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <MdOutlineArrowForwardIos />

          <ButtonGroup className="mr-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Usine
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus("Envoyée à l'usine")}>Envoyée à l'usine</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Commande Contrôle")}>Commande Contrôle</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Confirmée à l'usine")}>Confirmée à l'usine</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <MdOutlineArrowForwardIos />

          <ButtonGroup className="mr-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dépôt
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus("En dépôt")}>En dépôt</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Soldes réussie")}>Soldes réussie</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <MdOutlineArrowForwardIos />

          <ButtonGroup className="mr-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Livraison
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilterStatus("Livraison client")}>Livraison client</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Montage")}>Montage</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Sav")}>Sav</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>

          <MdOutlineArrowForwardIos />

          <ButtonGroup className="mr-2">
            <Button variant="success" onClick={() => setFilterStatus('Complété')}>Complété</Button>
          </ButtonGroup>

          <ButtonGroup className="mr-2">
            <Button variant="danger" onClick={() => setFilterStatus('')}>Reset</Button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default Status;
