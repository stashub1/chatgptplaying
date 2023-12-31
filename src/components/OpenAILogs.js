import React, { useState } from "react";
import { Row, Col, Container, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const OpenAILogs = (props) => {
  return (
    <div>
      <Row className="border border-primary bg-light border-2 position-fixed w-100">
        <h2 className="">Header</h2>
      </Row>
      <div style={{ paddingTop: "70px" }}>
        {/* Add paddingTop to push content below the fixed header */}
        <Row className="border border-primary bg-light border-2">
          <Col className="border border-primary border-2">
            <h2 className="">Col 1</h2>
          </Col>
          <Col className="border border-primary border-2">
            <h2 className="">Main col</h2>
            <div>
              <ListGroup>{/* ListGroupItems */}</ListGroup>
            </div>
          </Col>
          <Col className="border border-primary border-2">
            <h2 className="">Col 2</h2>
          </Col>
        </Row>
      </div>
      <Row className="border border-primary bg-light border-2">
        <h2 className="">Footer</h2>
      </Row>
    </div>
  );
};

export default OpenAILogs;
