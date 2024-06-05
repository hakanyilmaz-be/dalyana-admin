import React from 'react'
import { Container } from 'react-bootstrap'
import InvoiceTable from '../components/invoice/invoice-table/invoice-table'
import CreateNew from '../components/create-new/create-new'
import { Link } from 'react-router-dom'


const Factures = () => {
  return (

    <Container>
     <Link to="/factures/new">
        <CreateNew title="Créer une facture" />
      </Link>
    <h1 className='mt-5' style={{ textAlign: 'center', color: '#112e3b' }}>Factures</h1>
    <div className="title-border mt-3 mb-5"></div> 

    <InvoiceTable/>
    </Container>

  )
}

export default Factures