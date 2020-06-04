import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Card, Form, Row, Col, ButtonToolbar, Button, ButtonGroup, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {},
      invalidFields: {},
    };

    this.loadData = this.loadData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
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
    const { issue, invalidFields } = this.state;
    // eslint-disable-next-line no-console
    if (Object.keys(invalidFields).length !== 0) return;

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
    const data = await graphQLFetch(query, { id, changes });
    if (data) {
      this.setState({ issue: data.issueUpdate });
      // eslint-disable-next-line no-alert
      alert('issue updated!');
    }
  }

  async loadData() {
    const query = `query issue($id: Int!) {
      issue(id: $id) {
        id title status owner effort created due description
      }
    }`;

    const { match: { params: { id } } } = this.props;
    const nid = Number(id);
    const data = await graphQLFetch(query, { id: nid });

    this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
  }

  render() {
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
    const { invalidFields } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>{`Editing issue: ${id}`}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={this.handleSubmit}>
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
