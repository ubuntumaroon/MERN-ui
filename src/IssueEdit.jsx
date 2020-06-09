import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Card, Form, Row, Col, ButtonToolbar, Button, ButtonGroup, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';

class IssueEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id title status owner effort created due description
      }
    }`;
    const { params: { id: sid } } = match;
    const id = Number(sid);
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false,
    };

    this.loadData = this.loadData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const { issue } = this.state;
    if (issue == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(e, natureValue) {
    const { name, value: textValue } = e.target;
    const value = natureValue === undefined ? textValue : natureValue;
    this.setState((prevState) => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const { showSuccess, showError } = this.props;
    const query = `mutation issueUpdate(
      $id: Int!
      $changes: IssueUpdateInputs!
    ) {
      issueUpdate(
        id: $id
        changes: $changes
    ) {
      id title status owner
      effort created due description
      } 
    }`;

    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { id, changes }, showError);
    if (data) {
      this.setState({ issue: data.issueUpdate });
      // eslint-disable-next-line no-alert
      showSuccess('issue updated!');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);
    this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { issue } = this.state;
    if (issue == null) return null;

    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { issue: { title, status } } = this.state;
    const { issue: { owner, effort, description } } = this.state;
    const { issue: { created, due } } = this.state;

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert variant="danger" dismissible onClose={this.dismissValidation}>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Please check invalid field before submitting.</p>
        </Alert>
      );
    }

    return (
      <Card>
        <Card.Header>
          <Card.Title>{`Editing issue: ${id}`}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={this.handleSubmit}>
            {validationMessage}
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Created</Form.Label>
              <Col sm={9}>
                <Form.Control plaintext readOnly defaultValue={created.toDateString()} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Status</Form.Label>
              <Col sm={9}>
                <Form.Control as="select" defaultValue={status} onChange={this.onChange}>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Owner</Form.Label>
              <Col sm={9}>
                <Form.Control as={TextInput} name="Owner" value={owner} onChange={this.onChange} key={id} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Effort</Form.Label>
              <Col sm={9}>
                <Form.Control as={NumInput} name="effort" value={effort} onChange={this.onChange} key={id} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Due</Form.Label>
              <Col sm={9}>
                <Form.Control as={DateInput} name="due" value={due} onChange={this.onChange} onValidityChange={this.onValidityChange} key={id} />
                <Form.Control.Feedback type="invalid">Please input a valid date</Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Title</Form.Label>
              <Col sm={9}>
                <Form.Control as={TextInput} name="title" value={title} onChange={this.onChange} key={id} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>Description</Form.Label>
              <Col sm={9}>
                <Form.Control as={TextInput} tag="textarea" rows={8} cols={50} name="description" value={description} onChange={this.onChange} key={id} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm={{ span: 6, offset: 3 }}>
                <ButtonToolbar>
                  <ButtonGroup className="mr-2">
                    <Button type="submit">Submit</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <LinkContainer to="/issues">
                      <Button variant="link">Back</Button>
                    </LinkContainer>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

const IssueEditWithToast = withToast(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;

export default IssueEditWithToast;
