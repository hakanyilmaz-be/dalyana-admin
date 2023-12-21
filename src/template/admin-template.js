import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import SideBar from '../components/side-bar/side-bar'
import "./admin-template.css"
import TopBar from '../components/header/top-bar'
import Spacer from '../components/spacer/Spacer'

const AdminTemplate = ( {children}) => {
  return (
    <Container fluid className="admin-template">
        <Row>
            <Col lg={3} className= 'sidebar sticky-top'>
                <SideBar/>
            </Col>
            <Col lg={9} className='p-5'>
                <TopBar/>
                <Spacer/>
                {children}
            </Col>
        </Row>
    </Container>
  )
}

export default AdminTemplate