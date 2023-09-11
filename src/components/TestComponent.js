import React, { useState } from "react";
import { Row, Col, Container, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

const TestComponent = (props) => {
  const generateListGroupItems = () => {
    let items = [];
    for (let i = 0; i < 20; i++) {
      items.push(<li key={i}>Item 1</li>);
    }
    return items;
  };

  return (
    <div>
      <Header />

      <div style={{ paddingTop: "60px" }}>
        {/* Add paddingTop to push content below the fixed header */}
        <Row className="border border-primary bg-light border-2">
          <Col className="border border-primary border-2">
            <h2 className="">Col 1</h2>
          </Col>
          <Col className="border border-primary border-2">
            <h2 className="">Main col</h2>
            <div>
              <ul>{generateListGroupItems()}</ul>
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

export default TestComponent;
