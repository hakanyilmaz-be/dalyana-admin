import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SideBar from '../components/side-bar/side-bar'
import "./admin-template.css"
import TopBar from '../components/header/top-bar'

const AdminTemplate = ( {children}) => {
  return (
    <Container fluid className="admin-template">
        <Row>
            <Col lg={3} className= 'sidebar'>
                <SideBar/>
            </Col>
            <Col lg={9} className='p-5'>
                <TopBar/>
                {children}
            </Col>
        </Row>
    </Container>
  )
}

export default AdminTemplate