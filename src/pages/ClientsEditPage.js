import React from "react";
import DevisCommandeTableForCustomerPage from "../components/devis-commande-table-for-customer-page/devis-commande-table-for-customer-page";
import UpdateCustomer from "../components/update-customer/update-customer";

const ClientsEditPage = ({ showProjectList = true }) => {
  
  return (
    <>
   
      <UpdateCustomer/>
      {showProjectList && (
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
    </>
  );
};

export default ClientsEditPage;
