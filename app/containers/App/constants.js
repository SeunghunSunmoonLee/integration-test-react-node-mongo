/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const SAVE_USER_ANSWERS = 'boilerplate/App/SAVE_USER_ANSWERS';
export const FINAL_SUBMIT_FORM = 'boilerplate/App/FINAL_SUBMIT_FORM';
export const SET_COINS = 'boilerplate/App/SET_COINS';
export const DEFAULT_LOCALE = 'en';
export const GET_LISTS = 'GET_LISTS';
export const GET_LISTS_REQUEST = 'GET_LISTS_REQUEST';
export const GET_LISTS_SUCCESS = 'GET_LISTS_SUCCESS';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_LIST = 'MOVE_LIST';
export const TOGGLE_DRAGGING = 'TOGGLE_DRAGGING';
export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const SEARCH_LISTS = 'SEARCH_LISTS';
export const SEARCH_LISTS_SUCCESS = 'SEARCH_LISTS_SUCCESS';
export const DELETE_COMMENTS = 'DELETE_COMMENTS';
export const DELETE_COMMENTS_SUCCESS = 'DELETE_COMMENTS_SUCCESS';
