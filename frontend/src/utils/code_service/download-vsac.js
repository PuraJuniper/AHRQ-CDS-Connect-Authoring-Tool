import axios from 'axios';
import { Code, ValueSet } from 'cql-execution';

const API_BASE = process.env.REACT_APP_API_URL;

function downloadFromVSAC(username, password, input, vsDB = {}) {
  const vsJSON = {};
  const keys = Object.keys(input);
  keys.forEach((val, idx) => {
    if (!(input[val].id in vsDB)) {
      vsJSON[input[val].name] = input[val].id;
    }
  });
  if (Object.keys(vsJSON).length > 0) {
    const oids = Object.keys(vsJSON).map(k => vsJSON[k]);
    const promises = oids.map(oid =>
      // Catch errors and convert to resolutions returning an error.  This ensures Promise.all waits for all promises.
      // See: http://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises
      getVSDetailsByOIDFHIR(oid, username, password, vsDB)
        .catch(err => new Error(`Error downloading valueset: ${oid}`)));
    return Promise.all(promises)
      .then((results) => { // eslint-disable-line consistent-return
        const errors = results.filter(r => r instanceof Error);
        if (errors.length > 0) {
          return Promise.reject(errors);
        }
      });
  }
  return Promise.resolve();
}

function getVSDetailsByOIDFHIR(oid, username, password, vsDB) {
  const auth = {
    username,
    password
  };

  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/fhir/vs/${oid}`, { auth })
      .then((result) => {
        const codes = [];
        result.data.codes.forEach((code) => {
          codes.push(new Code(code.code, code.codeSystemURI, code.codeSystemVersion, code.displayName));
        });
        const vsOID = result.data.oid;
        const vsVersion = result.data.version;
        vsDB[vsOID] = {};
        vsDB[vsOID][vsVersion] = new ValueSet(vsOID, vsVersion, codes);
        resolve(result.data);
      })
      .catch(error => reject(error));
  });
}

export default downloadFromVSAC;