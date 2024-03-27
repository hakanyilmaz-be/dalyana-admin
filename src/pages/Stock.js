import React from 'react'
import { Container } from 'react-bootstrap'
import StockListTable from '../components/stock/stock-list-table'

const Stock = () => {
  return (
    <Container>
    <h2 style={{ textAlign: 'center', color: '#112e3b' }}>Gestion de Stock</h2>
    <StockListTable/>
    
    </Container>
  )
}

export default Stock