import axios from 'axios';
import Promise from 'promise';

import {
  VSAC_AUTHENTICATION_REQUEST, VSAC_AUTHENTICATION_RECEIVED,
  VSAC_LOGIN_REQUEST, VSAC_LOGIN_SUCCESS, VSAC_LOGIN_FAILURE,
  SET_VSAC_AUTH_STATUS
} from './types';

const API_BASE = process.env.REACT_APP_API_URL;

// ------------------------- AUTHENTICATION -------------------------------- //

function requestAuthentication() {
  return {
    type: VSAC_AUTHENTICATION_REQUEST
  };
}

function authenticationReceived(time) {
  const date = new Date(time);
  return {
    type: VSAC_AUTHENTICATION_RECEIVED,
    timeLastAuthenticated: date
  };
}

function sendAuthenticationRequest() {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE}/vsac/checkAuthentication`)
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199
      .then(result => resolve(result.data))
=======
      .then(result => {console.log(result); resolve(result.data)})
>>>>>>> Added modal, actions, and reducers for logging into VSAC
      .catch(error => reject(error));
  });
}

export function checkVSACAuthentication() {
  return (dispatch) => {
    dispatch(requestAuthentication());

<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199
    return sendAuthenticationRequest()
=======
    sendAuthenticationRequest()
>>>>>>> Added modal, actions, and reducers for logging into VSAC
      .then(data => dispatch(authenticationReceived(data)))
      .catch(() => dispatch(authenticationReceived(null)));
  };
}

// ------------------------- LOGIN ----------------------------------------- //

function requestLogin() {
  return {
    type: VSAC_LOGIN_REQUEST
  };
}

function loginSuccess() {
<<<<<<< a971ab19c192ccc42276ede23e44e6a9b20e6199
  // Round date to nearest second.
  const date = new Date();
  date.setSeconds(date.getSeconds() + (Math.round(date.getMilliseconds() / 1000)));
  date.setMilliseconds(0);
  return {
    type: VSAC_LOGIN_SUCCESS,
    timeLastAuthenticated: date
=======
  return {
    type: VSAC_LOGIN_SUCCESS,
    timeLastAuthenticated: new Date()
>>>>>>> Added modal, actions, and reducers for logging into VSAC
  };
}

function loginFailure(error) {
  return {
    type: VSAC_LOGIN_FAILURE,
    status: error.response.status,
    statusText: error.response.statusText
  };
}

function sendLoginRequest(username, password) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_BASE}/vsac/login`, { username, password })
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

export function loginVSACUser(username, password) {
  return (dispatch) => {
    dispatch(requestLogin());

    return sendLoginRequest(username, password)
      .then(() => dispatch(loginSuccess()))
      .catch(error => dispatch(loginFailure(error)));
  };
}

// ------------------------- AUTH STATUS ----------------------------------- //

export function setVSACAuthStatus(status) {
  return {
    type: SET_VSAC_AUTH_STATUS,
    status
  };
}

