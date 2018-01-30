import { format } from 'date-fns';

function loadExhibits(callback) {
  return fetch('/api/neatline_exhibits', {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseExhibitsJSON)
    .then(callback);
}

function loadRecords(exhibit_id, callback) {
  return fetch(`/api/neatline_records?exhibit_id=${exhibit_id}`, {
    accept: 'application/json'
  })
    .then(checkStatus)
    .then(parseRecordsJSON)
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

function parseExhibitsJSON(response) {
  return response.json().then(exhibits => {
    exhibits.forEach(exhibit => {
      if ('o:owner' in exhibit) exhibit['o:owner'] = exhibit['o:owner']['@id'];
      if ('o:added' in exhibit) exhibit['o:added'] = format(exhibit['o:added']['@value'], 'MMM D, YYYY');
    });
    return exhibits;
  });
}

function parseRecordsJSON(response) {
  return response.json().then(records => {
    records.forEach(record => {
      if ('o:owner' in record) record['o:owner'] = record['o:owner']['@id'];
      if ('o:added' in record) record['o:added'] = format(record['o:added']['@value'], 'MMM D, YYYY');
      if ('o:coverage' in record) record['o:coverage'] = JSON.parse(record['o:coverage']);
    });
    return records;
  })
}

const ApiClient = { loadExhibits, loadRecords };
export default ApiClient;
