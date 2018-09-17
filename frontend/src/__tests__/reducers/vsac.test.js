import * as types from '../../actions/types';
import reducer from '../../reducers/vsac';

describe.only('vsac reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isAuthenticating: false,
      timeLastAuthenticated: null,
      authStatus: null,
      authStatusText: '',
      isSearchingVSAC: false,
      searchResults: [],
      searchCount: 0,
      isRetrievingDetails: false,
      detailsCodes: [],
      username: null,
      password: null,
      codeData: null,
      isValidCode: null,
      isValidatingCode: false
    });
  });

  // ----------------------- AUTHENTICATION -------------------------------- //
  it('should check if a user is authenticated', () => {
    let action = { type: types.VSAC_AUTHENTICATION_REQUEST };
    let newState = { isAuthenticating: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isAuthenticating: false };
    expect(reducer(previousState, action)).toEqual(newState);

    const date = new Date();
    date.setSeconds(date.getSeconds() + (Math.round(date.getMilliseconds() / 1000)));
    date.setMilliseconds(0);
    action = { type: types.VSAC_AUTHENTICATION_RECEIVED, timeLastAuthenticated: date };
    newState = {
      isAuthenticating: false,
      timeLastAuthenticated: date
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- LOGIN ----------------------------------------- //
  it('should handle logging the user in to vsac', () => {
    let action = { type: types.VSAC_LOGIN_REQUEST };
    let newState = { isAuthenticating: true, authStatus: null };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isAuthenticating: false, authStatus: 'Test status' };
    expect(reducer(previousState, action)).toEqual(newState);

    const date = new Date();
    date.setSeconds(date.getSeconds() + (Math.round(date.getMilliseconds() / 1000)));
    date.setMilliseconds(0);
    action = { type: types.VSAC_LOGIN_SUCCESS, timeLastAuthenticated: date };
    newState = {
      isAuthenticating: false,
      timeLastAuthenticated: date,
      authStatus: 'loginSuccess',
      authStatusText: 'You have been successfully logged in to VSAC.'
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.VSAC_LOGIN_FAILURE, status: '401', statusText: 'Unauthorized' };
    newState = {
      isAuthenticating: false,
      timeLastAuthenticated: null,
      authStatus: 'loginFailure',
      authStatusText: 'Authentication Error: 401 Unauthorized, please try again.'
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ------------------------- AUTH STATUS ----------------------------------- //
  it('should handle setting the vsac auth status', () => {
    const action = { type: types.SET_VSAC_AUTH_STATUS, status: 'Test status' };
    const newState = { authStatus: 'Test status' };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { authStatus: 'Old test status' };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  it('should reset to default when logging out', () => {
    const action = { type: types.LOGOUT_REQUEST };
    const newState = {
      isAuthenticating: false,
      timeLastAuthenticated: null,
      authStatus: null,
      authStatusText: '',
      isSearchingVSAC: false,
      searchResults: [],
      searchCount: 0,
      isRetrievingDetails: false,
      detailsCodes: [],
      username: null,
      password: null,
      codeData: null,
      isValidCode: null,
      isValidatingCode: false
    };
    expect(reducer({ authStatus: 'Test status' }, action)).toEqual(newState);
  });

  // ----------------------- SEARCH ---------------------------------------- //
  it('should handle searching for value sets', () => {
    let action = { type: types.VSAC_SEARCH_REQUEST };
    let newState = { isSearchingVSAC: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isSearchingVSAC: false };
    expect(reducer(previousState, action)).toEqual(newState);

    const count = 2;
    const results = [{ a: 1 }, { b: 2 }];
    action = { type: types.VSAC_SEARCH_SUCCESS, searchCount: count, searchResults: results };
    newState = {
      isSearchingVSAC: false,
      searchCount: count,
      searchResults: results
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.VSAC_SEARCH_FAILURE };
    newState = {
      isSearchingVSAC: false,
      searchResults: [],
      searchCount: 0
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- DETAILS --------------------------------------- //
  it('should handle getting value set details', () => {
    let action = { type: types.VSAC_DETAILS_REQUEST };
    let newState = { isRetrievingDetails: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isRetrievingDetails: false };
    expect(reducer(previousState, action)).toEqual(newState);

    const codes = [{ code: '123-4' }, { code: '456-7' }];
    action = { type: types.VSAC_DETAILS_SUCCESS, codes };
    newState = {
      isRetrievingDetails: false,
      detailsCodes: codes
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.VSAC_DETAILS_FAILURE };
    newState = {
      isRetrievingDetails: false,
      detailsCodes: []
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- VALIDATION ------------------------------------ //
  it('should handle validating a code correctly', () => {
    let action = { type: types.VALIDATE_CODE_REQUEST };
    let newState = { isValidatingCode: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { isValidatingCode: false };
    expect(reducer(previousState, action)).toEqual(newState);

    const codeData = {};
    action = { type: types.VALIDATE_CODE_SUCCESS, codeData };
    newState = {
      isValidatingCode: false,
      isValidCode: true,
      codeData
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.VALIDATE_CODE_FAILURE };
    newState = {
      isValidatingCode: false,
      isValidCode: false,
      codeData: null
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.VALIDATE_CODE_RESET };
    newState = {
      isValidatingCode: false,
      isValidCode: null,
      codeData: null
    };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});