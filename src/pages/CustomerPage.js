import React, { useState } from "react";
import DevisCommandeTableForCustomerPage from "../components/devis-commande-table-for-customer-page/devis-commande-table-for-customer-page";
import UpdateCustomer from "../components/update-customer/update-customer";
import CreateNew from "../components/create-new/create-new";
import CreateNewDevisCommande from "../components/create-new-devis-commande/create-new-devis-commande";
import { Modal, Button } from "react-bootstrap";

const CustomerPage = ({ showProjectList = true }) => {
  const [showCreateNewDevisCommande, setShowCreateNewDevisCommande] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCreateNewClick = () => {
    if (showCreateNewDevisCommande) {
      setShowCancelModal(true);
    } else {
      setShowCreateNewDevisCommande(true);
    }
  };

  const handleCancelCreation = () => {
    setShowCreateNewDevisCommande(false);
    setShowCancelModal(false);
  };

  return (
    <>
      <UpdateCustomer />
      <CreateNew 
        title={showCreateNewDevisCommande ? "Annuler la création du projet" : "Créer un Nouveau Projet"} 
        onClick={handleCreateNewClick} 
        variant={showCreateNewDevisCommande ? "warning" : "dark"}
      />
      <div style={{ height: "40px" }}></div>

      {showCreateNewDevisCommande && <CreateNewDevisCommande />}

      {showProjectList && !showCreateNewDevisCommande && (
        <div>
          <h2
            className="mb-4 mt-4"
            style={{ textAlign: "center", color: "#112e3b" }}
          >
            Listes de Devis & Projets
          </h2>
          <div className="title-border mt-3 mb-5"></div>

          <DevisCommandeTableForCustomerPage />
        </div>
      )}

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l'annulation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir annuler la création du projet ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Non
          </Button>
          <Button variant="danger" onClick={handleCancelCreation}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerPage;
