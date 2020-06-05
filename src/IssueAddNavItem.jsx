import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Nav, OverlayTrigger, Modal, Tooltip,
  Form, FormGroup, Button,
} from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import graphQLFetch from './graphQLFetch.js';
import Toast from './Toast.jsx';

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  showSuccess(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'success' });
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'warning' });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };

    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    this.hideModal();
    const data = await graphQLFetch(query, { issue }, this.showError);
    if (data) {
      const { history } = this.props;
      this.showSuccess('Issue added, please add more details');
      history.push(`/edit/${data.issueAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { toastVisible, toastType, toastMessage } = this.state;
    const toast = (
      <Toast
        toastType={toastType}
        toastMessage={toastMessage}
        onClose={this.dismissToast}
        show={toastVisible}
        delay={6000}
        autohide
      />
    );
    return (
      <>
        <Nav.Link onClick={this.showModal}>
          <OverlayTrigger placement="left" delayShow={1000} overlay={<Tooltip id="create-issue">Create Issue</Tooltip>}>
            <FaPlus />
          </OverlayTrigger>
        </Nav.Link>
        <Modal
          show={showing}
          onHide={this.hideModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdd">
              <FormGroup>
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <Form.Label>Owner</Form.Label>
                <Form.Control name="owner" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
        {toast}
      </>
    );
  }
}

export default withRouter(IssueAddNavItem);
