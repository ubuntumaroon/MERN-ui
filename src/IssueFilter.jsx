import React from 'react';
import { Link } from 'react-router-dom';

export default function IssueFilter() {
  return (
    <div>
      <Link to="/issues">All Issues</Link>
      {' | '}
      <Link to={{ pathname: '/issues', search: '?status=New' }}>New Issues</Link>
      {' | '}
      <Link to={{ pathname: '/issues', search: '?status=Assigned' }}>Assigned</Link>
    </div>
  );
}
