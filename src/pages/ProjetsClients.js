import React from 'react'
import { Container } from 'react-bootstrap'
import CreateNewCustomerCommand from '../components/new-customer-command/create-new-customer-command'
import Status from '../components/status/status'
import DevisCommandeTable from '../components/devis-commande-table/devis-commande-table'


const ProjetsClients = () => {
  return (

    <Container>
      <CreateNewCustomerCommand/>
      <Status/>
      <DevisCommandeTable/>
    </Container>

   
  )
}

export default ProjetsClients