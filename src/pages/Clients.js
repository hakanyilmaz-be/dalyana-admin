// Clients.js
import React, { useState } from 'react';
import CreateNewCustomer from '../components/create-new-customer/create-new-customer';
import CustomerTable from '../components/customer-table/customer-table';

const Clients = () => {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleUpdateRecords = () => {
    setUpdateTrigger(prev => !prev);
  };

  return (
    <> 
      <CreateNewCustomer onUpdateRecords={handleUpdateRecords} />
      <CustomerTable updateTrigger={updateTrigger} />
    </>
  );
};

export default Clients;
