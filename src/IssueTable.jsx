import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import { FaTrash, FaTimes, FaEdit } from 'react-icons/fa';

const IssueRow = withRouter(({
  issue,
  location: { search },
  closeIssue,
  deleteIssue,
  index,
}) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  const editTooltip = (
    <Tooltip id="close-tooltip" placement="top">Edit Issue</Tooltip>
  );
  const closeTooltip = (
    <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
  );
  const deleteTootip = (
    <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
  );

  function onClose(e) {
    e.preventDefault();
    closeIssue(index);
  }

  function onDelete(e) {
    e.preventDefault();
    deleteIssue(index);
  }

  const tableRow = (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ' '}</td>
      <td>{issue.title}</td>
      <td>
        <OverlayTrigger delayShow={1000} overlay={editTooltip}>
          <LinkContainer to={`/edit/${issue.id}`}>
            <Button size="sm" variant="outline-secondary">
              <FaEdit />
            </Button>
          </LinkContainer>
        </OverlayTrigger>
        {' '}
        <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
          <Button size="sm" variant="outline-secondary" onClick={onClose}>
            <FaTimes />
          </Button>
        </OverlayTrigger>
        {' '}
        <OverlayTrigger delayShow={1000} overlay={deleteTootip}>
          <Button size="sm" variant="outline-secondary" onClick={onDelete}>
            <FaTrash />
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
  );

  return (
    <LinkContainer to={selectLocation}>
      {tableRow}
    </LinkContainer>
  );
});


export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}
