import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
    };
    const { createIssue } = this.props;
    createIssue(issue);
    form.owner.value = '';
    form.title.value = '';
  }

  render() {
    return (
      <Form className="form-inline" name="issueAdd" onSubmit={this.handleSubmit}>
        <Form.Label className="mr-2 mb-2">Owner</Form.Label>
        <Form.Control className="mr-2 mb-2" type="text" name="owner" placeholder="Owner" />
        <Form.Label className="mr-2 mb-2">Title</Form.Label>
        <Form.Control className="mr-2 mb-2" type="text" name="title" placeholder="Title" />
        <Button type="submit" className="mb-2">Add</Button>
      </Form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
