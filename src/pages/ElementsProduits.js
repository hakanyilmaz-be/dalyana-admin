import React from 'react'
import { Container } from 'react-bootstrap'
import ElementsType from '../components/elements/elements-type'
import ElementListTable from '../components/elements/element-list-table'


const ElementsProduits = () => {
  return (

    <Container>
    <h2 style={{ textAlign: 'center', color: '#112e3b' }}>Elements & Produits</h2>
     <ElementsType/>
      <ElementListTable/>
    </Container>
   
  )
}

export default ElementsProduits