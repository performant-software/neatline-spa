import { format } from 'date-fns';

function loadExhibits(callback) {
  return fetch('api/neatline_exhibits', {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(callback);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error);
  throw error;
}

function parseJSON(response) {
  return response.json().then(exhibits => {
    exhibits.forEach(exhibit => {
      if ('o:owner' in exhibit) exhibit['o:owner'] = exhibit['o:owner']['@id'];
      if ('o:added' in exhibit) exhibit['o:added'] = format(exhibit['o:added']['@value'], 'MMM D, YYYY');
    });
    return exhibits;
  });
}

const ApiClient = { loadExhibits };
export default ApiClient;
