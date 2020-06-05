import React from 'react';
import {
  Navbar, Nav, NavDropdown,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';

function NavBar() {
  return (
    <>
      <Navbar expand="md" bg="light" variant="light">
        <Navbar.Brand>Issue Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer exact to="/">
              <Nav.Link>
                Home
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/issues">
              <Nav.Link>Issue List</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/report">
              <Nav.Link>Report</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav>
            <IssueAddNavItem />
            <NavDropdown title="More" id="user-dropdown">
              <NavDropdown.Item>About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

function Footer() {
  return (
    <small>
      <p className="text-center">
        Book project of &quot;MERN&quot; book.
      </p>
    </small>
  );
}

export default function Page() {
  return (
    <>
      <NavBar />
      <div className="container-fluid mt-2">
        <Contents />
      </div>
      <Footer />
    </>
  );
}
