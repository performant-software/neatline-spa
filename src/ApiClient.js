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
  return response.json();
}

const ApiClient = { loadExhibits };
export default ApiClient;
