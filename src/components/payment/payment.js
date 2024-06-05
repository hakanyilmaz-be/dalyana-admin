import React, { useState, useEffect } from "react";
import { Form, Button, Table, Row, Col, Modal } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import "./payment.css";
import grandTotalValue from "../projet/formInitialValues.json";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(grandTotalValue.grandTotal);

  useEffect(() => {
    const totalAmountPaid = payments.reduce((total, payment) => total + payment.amount, 0);
    setRemainingAmount(grandTotalValue.grandTotal - totalAmountPaid);
  }, [payments]);

  const handleAddPayment = () => {
    if (amount && paymentMethod && paymentDate) {
      setPayments([...payments, { amount: parseFloat(amount), method: paymentMethod, date: paymentDate }]);
      setAmount("");
      setPaymentMethod("");
      setPaymentDate("");
    }
  };

  const handleEditSave = () => {
    if (amount && paymentMethod && paymentDate) {
      const updatedPayments = [...payments];
      updatedPayments[editIndex] = { amount: parseFloat(amount), method: paymentMethod, date: paymentDate };
      setPayments(updatedPayments);
      setEditIndex(null);
      setShowModal(false);
      setAmount("");
      setPaymentMethod("");
      setPaymentDate("");
    }
  };

  const handleEdit = (index) => {
    const payment = payments[index];
    setAmount(payment.amount);
    setPaymentMethod(payment.method);
    setPaymentDate(payment.date);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce paiement ?");
    if (confirmed) {
      const updatedPayments = payments.filter((_, i) => i !== index);
      setPayments(updatedPayments);
    }
  };

  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="payment-container">
      <h2 className="text-center" style={{ fontSize: "2.3rem" }}>Paiement</h2>
      <div className="title-border mt-3 mb-5"></div>
      <Form>
        <Row>
          <Col lg={4}>
            <Form.Group controlId="formAmount">
              <Form.Label>Montant</Form.Label>
              <NumericFormat
                className="form-control"
                value={amount}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                suffix={" €"}
                placeholder="Entrer le montant"
                onValueChange={(values) => setAmount(values.floatValue || '')}
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Mode de paiement</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Sélectionnez le mode de paiement</option>
                <option value="Carte de crédit">Carte de crédit</option>
                <option value="Transfert">Transfert</option>
                <option value="Paiement">Paiement</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group controlId="formPaymentDate">
              <Form.Label>Date de paiement</Form.Label>
              <Form.Control
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button className="mt-3" variant="outline-primary" onClick={handleAddPayment}>
          Ajouter un paiement
        </Button>
      </Form>
      <h4 className="mt-5">Paiements</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Mode de paiement</th>
            <th>Montant</th>
            <th>Date de paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{payment.method}</td>
              <td>
                <NumericFormat
                  value={payment.amount}
                  displayType={"text"}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale={true}
                  suffix={" €"}
                />
              </td>
              <td>{formatDate(payment.date)}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(index)}>
                  Modifier
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <strong>Total</strong>
            </td>
            <td>
              <strong>
                <NumericFormat
                  value={totalAmount}
                  displayType={"text"}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale={true}
                  suffix={" €"}
                />
              </strong>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAmountModal">
              <Form.Label>Montant</Form.Label>
              <NumericFormat
                className="form-control"
                value={amount}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale={true}
                suffix={" €"}
                placeholder="Entrer le montant"
                onValueChange={(values) => setAmount(values.floatValue || '')}
              />
            </Form.Group>
            <Form.Group controlId="formPaymentMethodModal">
              <Form.Label>Mode de paiement</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Sélectionnez le mode de paiement</option>
                <option value="Carte de crédit">Carte de crédit</option>
                <option value="Transfert">Transfert</option>
                <option value="Paiement">Paiement</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPaymentDateModal">
              <Form.Label>Date de paiement</Form.Label>
              <Form.Control
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Mettre à jour
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="remaining-amount mt-5 mb-5">
        <h4>Montant restant à payer:</h4>
        <NumericFormat
          value={remainingAmount}
          displayType={"text"}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={2}
          fixedDecimalScale={true}
          suffix={" €"}
          className="remaining-amount-value"
        />
      </div>
    </div>
  );
};

export default Payment;
