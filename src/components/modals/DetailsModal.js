import React, { useState } from "react";
import { Button, Stack, Table, Row, Col, Modal, Form } from "react-bootstrap";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

const DetailsModal = (props) => {
  const [error, setError] = useState("");

  const closeModal = () => {
    props.setShow(false);
  };

  return (
    <div>
      <Modal show={props.show} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="parent-container ">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <JSONPretty id="json-pretty" data={props.data}></JSONPretty>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailsModal;
