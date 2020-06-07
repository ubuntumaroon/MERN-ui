
import fetch from 'isomorphic-fetch';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

export default async function graphQLFetch(query, variables = {}, showError = null) {
  const apiEndpoint = (__isBrowser__) // eslint-disable-line no-undef
    ? window.ENV.UI_API_ENDPOINT
    : process.env.UI_SERVER_API_ENDPOINT;
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        if (showError) showError(`${error.message}:\n ${details}`);
      }
      if (showError) showError('Wow, something went wrong, please try again later');
    }

    return result.data;
  } catch (e) {
    if (showError) showError(`Error in sending data: ${e.message}`);
    return null;
  }
}
