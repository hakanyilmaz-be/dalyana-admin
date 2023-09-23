import React from 'react'
import { Container } from 'react-bootstrap'
import CreateNewCustomerCommand from '../components/new-customer-command/create-new-customer-command'
import Status from '../components/status/status'


const DevisCommandes = () => {
  return (

    <Container>
      <CreateNewCustomerCommand/>
      <Status/>
    </Container>

   
  )
}

export default DevisCommandes