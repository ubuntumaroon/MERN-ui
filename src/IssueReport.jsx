import React from 'react';
import { Card, Table } from 'react-bootstrap';
import URLSearchParams from '@ungap/url-search-params';

import IssueFilter from './IssueFilter.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import graphQLFetch from './graphQLFetch.js';

const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];
class IssueReport extends React.Component {
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { };
    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;

    const query = `query issueReport(
      $status: StatusType
      $effortMin: Int
      $effortMax: Int
    ) {
      issueCounts(
        status: $status
        effortMin: $effortMin
        effortMax: $effortMax
      ) {
        owner New Assigned Fixed Closed
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor(props) {
    super(props);
    const stats = store.initialData ? store.initialData.issueCounts : null;
    delete store.initialData;
    this.state = { stats };
  }

  componentDidMount() {
    const { stats } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(preProps) {
    const { location: { search: preSearch } } = preProps;
    const { location: { search } } = this.props;

    if (preSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await IssueReport.fetchData(match, search, showError);
    if (data) {
      this.setState({ stats: data.issueCounts });
    }
  }

  render() {
    const headerColumns = (
      statuses.map((status) => (
        <th key={status}>{status}</th>
      ))
    );

    const { stats } = this.state;
    if (stats == null) return null;

    const statRows = stats.map((counts) => (
      <tr key={counts.owner}>
        <td>{counts.owner}</td>
        {statuses.map((status) => (
          <td key={status}>{counts[status]}</td>
        ))}
      </tr>
    ));
    return (
      <>
        <Card>
          <Card.Header>
            <Card.Title>Filter</Card.Title>
          </Card.Header>
          <Card.Body>
            <IssueFilter urlBase="/report" />
          </Card.Body>
        </Card>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Owner</th>
              {headerColumns}
            </tr>
          </thead>
          <tbody>
            {statRows}
          </tbody>

        </Table>
      </>
    );
  }
}

const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.fetchData = IssueReport.fetchData;

export default IssueReportWithToast;
