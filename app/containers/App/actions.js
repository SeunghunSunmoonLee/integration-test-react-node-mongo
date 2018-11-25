/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */
import feathers from 'components/feathers'
// import {
//
// } from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
// export function loadRepos() {
//   return {
//     type: LOAD_REPOS,
//   };
// }

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
 export function setMeta(data) {
   return {
     type: 'SET_META',
     data
   };
 }
export function signIn(user) {
  return {
    type: 'SIGN_IN',
    user
  };
}
export function signOut() {
  feathers.logout()
  return {
    type: 'SIGN_OUT',
  };
}

export function SetSignUpModalVisible(value) {
  return {
    type: 'SET_SIGN_UP_MODAL_VISIBLE',
    value,
  };
}
export function SetCompanyRegisterModalVisible(value) {
  return {
    type: 'SET_COMPANY_REGISTER_MODAL_VISIBLE',
    value,
  };
}
export function SetGameRegisterModalVisible(value) {
  return {
    type: 'SET_GAME_REGISTER_MODAL_VISIBLE',
    value,
  }
}
export function SetAccountModalVisible(value) {
  return {
    type: 'SET_ACCOUNT_MODAL_VISIBLE',
    value,
  };
}
export function SetVerifyEmailModalVisible(value) {
  return {
    type: 'SET_VERIFY_EMAIL_MODAL_VISIBLE',
    value,
  };
}
export function SetSignInModalVisible(value) {
  return {
    type: 'SET_SIGN_IN_MODAL_VISIBLE',
    value,
  };
}
export function SetGDPRModalVisible(value) {
  return {
    type: 'SET_GDPR_MODAL_VISIBLE',
    value,
  };
}
export function SetPasswordModalVisible(value) {
  return {
    type: 'SET_PASSWORD_MODAL_VISIBLE',
    value,
  };
}
export function SetTwoFactorModalVisible(value) {
  return {
    type: 'SET_TWO_FACTOR_MODAL_VISIBLE',
    value,
  }
}
export function SetTWoFactorQRCode(value) {
  return {
    type: 'SET_TWO_FACTOR_QR_CODE',
    value,
  }
}
export function SetTwoFactorMethod(value) {
  return {
    type: 'SET_TWO_FACTOR_METHOD',
    value,
  }
}
