/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

// import update from 'immutability-helper';

// import {
//
// } from './constants';

// The initial state of the App
const initialState = {
  // loading: false,
  // error: false,
  // currentUser: false,
  // userData: {
  //   repositories: false,
  // },
  user: {
    signedIn: false,
    profile: null,
  },
};
function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_META':
      return { ...state,
        user: {
          ...state.user,
          gps: action.data.gps,
          IPAddress: action.data.IPAddress,
          country: action.data.country,
          countryCode: action.data.countryCode,
          city: action.data.city,
          timezone: action.data.timezone,
          zip: action.data.zip,
        }
      };
    case 'SIGN_IN':
      return { ...state,
        user: {
          ...state.user,
          signedIn: true,
          profile: action.user
        }
      };
    case 'SIGN_OUT':
      return { ...state,
        user: {
          signedIn: false,
          profile: null,
        }
      };


      case 'SET_SIGN_UP_MODAL_VISIBLE':
        return { ...state,
          SignUpModalVisible: action.value,
        };
      case 'SET_ACCOUNT_MODAL_VISIBLE':
        return { ...state,
          AccountModalVisible: action.value,
        };
      case 'SET_SIGN_IN_MODAL_VISIBLE':
        return { ...state,
          SignInModalVisible: action.value,
        };
      case 'SET_VERIFY_EMAIL_MODAL_VISIBLE':
        return { ...state,
          VerifyEmailModalVisible: action.value,
        };
      case 'SET_PASSWORD_MODAL_VISIBLE':
        return { ...state,
          PasswordModalVisible: action.value,
        };
      case 'SET_TWO_FACTOR_MODAL_VISIBLE':
        return { ...state,
          TwoFactorModalVisible: action.value,
        };


    default:
      return state;
  }
}

export default appReducer;
