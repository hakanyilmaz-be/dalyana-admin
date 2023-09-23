import React from "react";

import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import "./status.css";

const Status = () => {
  return (
    <>
      <div className="status-wrapper">
        <h2 className="status-title">Tous Les Statuts</h2>
        <div className="status-options">
          <Dropdown as={ButtonGroup}>
            <Button variant="success">Devis</Button>
          </Dropdown>

          <MdOutlineArrowForwardIos />

          <Dropdown as={ButtonGroup}>
            <Button variant="success">Bon de Commande</Button>
            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Bon de Commande</Dropdown.Item>
              <Dropdown.Item href="#/action-2">
                Bon de Commande Modifié
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MdOutlineArrowForwardIos />

          <Dropdown as={ButtonGroup}>
            <Button variant="success">À l'usine</Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">
                Commande envoyée à l'usine
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Commande Contrôle</Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Commande Confirmée à l'usine
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MdOutlineArrowForwardIos />

          <Dropdown as={ButtonGroup}>
            <Button variant="success">Au dépôt</Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">
                Commandes en dépôt
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Soldes réussie</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MdOutlineArrowForwardIos />

          <Dropdown as={ButtonGroup}>
            <Button variant="success">Livraison</Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Livraison client</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Montage</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Sav</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MdOutlineArrowForwardIos />

          <Dropdown as={ButtonGroup}>
            <Button variant="success">Complété</Button>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default Status;
