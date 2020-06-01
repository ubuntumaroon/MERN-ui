import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaTrash, FaTimes } from 'react-icons/fa';

const IssueRow = withRouter(({
  issue,
  location: { search },
  closeIssue,
  deleteIssue,
  index,
}) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  const closeTooltip = (
    <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
  );
  const deleteTootip = (
    <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
  );
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ' '}</td>
      <td>{issue.title}</td>
      <td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
        {' | '}
        <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
          <Button size="sm" variant="outline-secondary" onClick={() => { closeIssue(index); }}>
            <FaTimes />
          </Button>
        </OverlayTrigger>
        {' '}
        <OverlayTrigger delayShow={1000} overlay={deleteTootip}>
          <Button size="sm" variant="outline-secondary" onClick={() => { deleteIssue(index); }}>
            <FaTrash />
          </Button>
        </OverlayTrigger>
      </td>
    </tr>
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
    <table className="bordered-table">
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
    </table>
  );
}
