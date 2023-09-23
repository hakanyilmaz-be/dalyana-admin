import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const CreateNewCustomerCommand = () => {
  return (
    <Container>
      <Row >
        <Col lg={9} className="d-grid gap-2 mx-auto">
          <Button variant="primary" size="lg">
          Créer Nouveau Client en Devis
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateNewCustomerCommand;
