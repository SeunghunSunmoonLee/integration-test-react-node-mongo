/**
 * Test the HomePage
 */

 import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { push, ConnectedRouter } from 'react-router-redux';
import LanguageProvider from 'containers/LanguageProvider';
import configureStore from '../../../configureStore';
import createHistory from 'history/createBrowserHistory';
import { translationMessages } from '../../../i18n';

import App from 'containers/App';


const initialState = {};
const history = createHistory({ basename: '/' });
const store = configureStore(initialState, history);

const asyncFlush = () => new Promise(resolve => setTimeout(resolve, 1000));

describe('users see proper grade view after signing in', async () => {
  let screen;
  beforeEach(async () => {
      screen = mount(
        <Provider store={store}>
          <LanguageProvider locale="en" messages={translationMessages}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </LanguageProvider>
        </Provider>
      );
      screen.find(Provider).prop('store').dispatch(push('/'));

      await asyncFlush();
  });
  it('student sees his/her own grades after signing in', async () => {
    // click login from header
    screen.find('li.ant-menu-item').at(1).simulate('click');

    // enter email, password
    screen.find('input').at(0).instance().value = 'test-student@gmail.com';
    screen.find('input').at(1).instance().value = 'test-student';

    // click SignIn Button
    screen.find('button.login-form-button').at(0).simulate('click');

    // simulate backend feathers authentication
    const mockUser = {
      username: 'test-student',
      roles: ['student'],
      email: 'test-student@gmail.com',
    }
    screen.find(Provider).prop('store').dispatch({type: 'SIGN_IN', user: mockUser});
    await asyncFlush();

    screen.update()
    // console.log(screen.debug())

    // check if test-student get three rows of grades.
    expect(getItems().length).toEqual(3)

  });
  it('professor sees grades of students after signing in', async () => {
    // click login from header
    screen.find('li.ant-menu-item').at(1).simulate('click');

    // enter email, password
    screen.find('input').at(0).instance().value = 'professor@gmail.com';
    screen.find('input').at(1).instance().value = 'professor';

    // click SignIn Button
    screen.find('button.login-form-button').at(0).simulate('click');

    // simulate backend feathers authentication
    const mockUser = {
      username: 'professor',
      roles: ['professor'],
      email: 'professor@gmail.com',
    }
    screen.find(Provider).prop('store').dispatch({type: 'SIGN_IN', user: mockUser});
    await asyncFlush();

    screen.update()
    // console.log(screen.debug())

    // check if professor get six rows of grades.
    expect(getItems().length).toEqual(6)

  });
  function getItems() {
    return screen.find('tr.ant-table-row').map(node => node.text());
  }
});
