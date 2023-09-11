import React, { useState } from "react";

import { Row, Col, Nav, Navbar, Container, Button, ListGroup, ListGroupItem } from "react-bootstrap";

const Header = () => {
  return (
    <header>
      <Navbar expand="md" sticky="top" className="bg-body-tertiary sticky">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
