import * as types from '../actions/types';

const defaultState = {
  isAuthenticating: false,
  isAuthenticated: false,
  username: null,
  authStatus: null,
  authStatusText: ''
};

export default function auth(state = defaultState, action) {
  const isAuthenticated = action.username != null;

  switch (action.type) {
    case types.USER_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true });
    case types.USER_RECEIVED:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated,
        username: action.username
      });
    case types.LOGIN_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true, authStatus: null });
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        username: action.username,
        authStatus: 'loginSuccess',
        authStatusText: 'You have been successfully logged in.'
      });
    case types.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        authStatus: 'loginFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      });
    case types.LOGOUT_REQUEST:
      return Object.assign({}, state, { isAuthenticating: false, authStatus: null });
    case types.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        username: null,
        authStatus: 'logoutSuccess',
        authStatusText: 'You have been successfully logged out.'
      });
    case types.LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        authStatus: 'logoutFailure',
        authStatusText: `Authentication Error: ${action.status} ${action.statusText}, please try again.`
      });
    case types.SET_AUTH_STATUS:
      return Object.assign({}, state, { authStatus: action.status });
    default:
      return state;
  }
}
