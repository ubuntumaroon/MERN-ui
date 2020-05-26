import React from 'react';

export default function IssueEdit({ match }) {
  const { id } = match.params;
  return (
    <h2>{`Issue id: ${id}`}</h2>
  );
}
