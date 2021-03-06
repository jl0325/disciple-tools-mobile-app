/*
 * Action Types
 */
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_START = 'USER_LOGIN_START';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';
export const USER_LOGOUT = 'USER_LOGOUT';

export const GET_MY_USER_INFO = 'GET_MY_USER_INFO';
export const GET_MY_USER_INFO_START = 'GET_MY_USER_INFO_START';
export const GET_MY_USER_INFO_RESPONSE = 'GET_MY_USER_INFO_RESPONSE';
export const GET_MY_USER_INFO_SUCCESS = 'GET_MY_USER_INFO_SUCCESS';
export const GET_MY_USER_INFO_FAILURE = 'GET_MY_USER_INFO_FAILURE';

/*
 * Action Creators
 */
export function login(domain, username, password) {
  return {
    type: USER_LOGIN,
    domain,
    username,
    password,
  };
}

export function getUserInfo(domain, token) {
  return {
    type: GET_MY_USER_INFO,
    domain,
    token,
  };
}

export function logout() {
  return { type: USER_LOGOUT };
}
