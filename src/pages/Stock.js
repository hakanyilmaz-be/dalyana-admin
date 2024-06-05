import React from 'react'
import { Container } from 'react-bootstrap'
import StockListTable from '../components/stock/stock-list-table'

const Stock = () => {
  return (
    <Container>
    <h2 style={{ textAlign: 'center', color: '#112e3b' }}>Gestion de Stock</h2>
    <div className="title-border mt-3 mb-5"></div> 

    <StockListTable/>
    
    </Container>
  )
}

export default Stock