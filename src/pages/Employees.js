import React from 'react'
import { Container } from 'react-bootstrap'
import EmployeeListTable from '../components/employee-table/employee-list-table'


const Employees = () => {
  return (
    <Container>
    <h1 style={{ textAlign: 'center', color: '#112e3b' }}>Employees</h1>
    <div className="title-border mt-3 mb-5"></div> 

      <EmployeeListTable/>
    </Container>
  )
}
export default Employees