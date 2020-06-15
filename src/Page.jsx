import React from 'react';
import {
  Navbar, Nav, NavDropdown, Container, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
import IssueAddNavItem from './IssueAddNavItem.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import Search from './Search.jsx';
import UserContext from './UserContext.js';

function NavBar({ user, onUserChange }) {
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
          <Col sm={5}>
            <Search />
          </Col>
          <Nav>
            <IssueAddNavItem user={user} />
            <SignInNavItem user={user} onUserChange={onUserChange} />
            <NavDropdown title="More" id="user-dropdown">
              <LinkContainer to="/about">
                <NavDropdown.Item>About</NavDropdown.Item>
              </LinkContainer>
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

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: { signedIn: false } };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
      credentials: 'include',
    });

    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, givenName } = result;
    this.setState({ user: { signedIn, givenName } });
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <>
        <NavBar user={user} onUserChange={this.onUserChange} />
        <Container fluid className="mt-3">
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
          <Footer />
        </Container>
      </>
    );
  }
}
