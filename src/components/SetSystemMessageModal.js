import React, { useRef, useContext } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { DataContext } from "../contexts/DataContext";

const SetSystemMessageModal = (props) => {
  const dataRef = useRef(null);
  const { setSystemMessage, systemMessage } = useContext(DataContext);

  const closeModal = () => {
    props.setShow(false);
  };

  const handleSetSystemMessage = (e) => {
    e.preventDefault();
    setSystemMessage(dataRef.current.value);
    closeModal();
  };

  return (
    <div>
      <div>
        <Modal show={props.show} onHide={closeModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Set System Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Data</Form.Label>
              <Form.Control defaultValue={systemMessage ? systemMessage : "Enter your data.."} as="textarea" rows={10} ref={dataRef}></Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSetSystemMessage}>Ok</Button>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SetSystemMessageModal;
