import React from 'react';
import {
  NavItem, Modal, Button, NavDropdown, Nav,
} from 'react-bootstrap';

import withToast from './withToast.jsx';

class SignInNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabled: true,
      user: { signedIn: false, givenName: '' },
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId }).then(() => {
          this.setState({ disabled: false });
        });
      }
    });
  }

  async signIn() {
    this.hideModal();
    const { showError } = this.props;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const givenName = googleUser.getBasicProfile().getGivenName();
      this.setState({ user: { signedIn: true, givenName } });
    } catch (error) {
      showError(`Error with Google signin: ${error.error}`);
    }
  }

  signOut() {
    this.setState({ user: { signedIn: false, givenName: '' } });
  }

  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const { showError } = this.props;
    if (!clientId) {
      showError('Missing environment variable GOOGLE_CLIENT_ID');
      return;
    }
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

    const { showing, disabled } = this.state;
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
            <Button block disabled={disabled} variant="primary" onClick={this.signIn}>
              <img src="https://goo.gl/4yjp6B" alt="Sign In" />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withToast(SignInNavItem);
