import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./create-new.css";

const CreateNew = ({title}) => {
  return (
    <Container>
      <Row >
        <Col lg={9} className="d-grid gap-2 mx-auto">
          <Button className="create-button" size="lg">
          {title}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateNew;
