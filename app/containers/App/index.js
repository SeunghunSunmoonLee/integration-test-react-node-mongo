/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, {Fragment} from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import HomePage from 'containers/HomePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import './index.css';
import { Layout, Menu, Icon, AutoComplete, Input } from 'antd'
import axios from 'axios'

import feathers from 'components/feathers'
import {signIn, setMeta} from './actions'

import SignUpModal from 'components/SignUp';
import SignInModal from 'components/SignIn';
import GDPRModal from 'components/GDPR';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  async componentDidMount() {
    feathers.authenticate()
     .then(response => {
      // console.log('===Authenticated!', response);
      return feathers.passport.verifyJWT(response.accessToken);
     })
     .then(payload => {
       // console.log('===JWT Payload', payload);
       // console.log("===user_id",payload.userId)
        return feathers.service('users').get(payload.userId);
     })
     .then(user => {
       feathers.set('user', user);
       this.props.signIn(user)
     })
     .catch(error => {
       // console.error('===Error authenticating!', error);
       this.setState({ login: null })
     });
  }
  render() {
    return (
      <Fragment>
        <Helmet
          titleTemplate="SeunghunLee Software"
          defaultTitle="SeunghunLee Software"
        >
          <meta
            name="description"
            content="SeunghunLee Software"
          />

          <meta
            property="og:image"
            content="https://res.cloudinary.com/seunghunlee/image/upload/v1514172269/Web-Development-1920-1280-7_orpskh.jpg"
          />
          <meta
            property="og:title"
            content="SeunghunLee Software"
          />
          <meta property="og:url" content="http://www.seunghunlee.net" />
          <meta property="og:site_name" content="SeunghunLee" />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@seunghunSunmoon" />
          <meta
            name="twitter:title"
            content="SeunghunLee Software"
          />
          <meta
            name="twitter:description"
            content="SeunghunLee Software. React, Node.js, React Native, Machine Learning."
          />
          <meta
            name="twitter:image"
            content="https://res.cloudinary.com/seunghunlee/image/upload/v1514172269/Web-Development-1920-1280-7_orpskh.jpg"
          />

          {/*
            <base target="_blank" href="http://leeart.co" />
            <link rel="canonical" href="http://leeart.co" />
            */}
          <link
            rel="icon"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />

          <link
            rel="apple-touch-icon"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />

          <link
            rel="icon"
            href="https://res.cloudinary.com/seunghunlee/image/upload/v1515485736/safari-pinned-tab2_xdrpuz.png"
          />
        </Helmet>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
        <SignInModal />
        <SignUpModal />
        <GDPRModal />
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  setMeta: (data) => dispatch(setMeta(data)),
  signIn: (user) => dispatch(signIn(user)),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
