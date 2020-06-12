import React from 'react';
import {
  NavItem, Modal, Button, NavDropdown, Nav,
} from 'react-bootstrap';

export default class SignInNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      user: { signedIn: false, givenName: '' },
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  signIn() {
    this.hideModal();
    this.setState({
      user: {
        signedIn: true,
        givenName: 'Guest',
      },
    });
  }

  signOut() {
    this.setState({ user: { signedIn: false, givenName: '' } });
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  render() {
    const { user } = this.state;
    if (user.signedIn) {
      return (
        <NavDropdown title={user.givenName} id="user">
          <NavDropdown.Item onClick={this.signOut}>Sigh out</NavDropdown.Item>
        </NavDropdown>
      );
    }

    const { showing } = this.state;
    return (
      <>
        <NavItem onClick={this.showModal}>
          <Nav.Link>Sign In</Nav.Link>
        </NavItem>

        <Modal keyboard show={showing} onHide={this.hideModal} size="sm">
          <Modal.Header closeButton>
            <Modal.Title>Sign in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            to be filled with a form
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>Cancel</Button>
            <Button variant="primary" onClick={this.signIn}>Sign in</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
