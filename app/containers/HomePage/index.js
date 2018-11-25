/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import {
  Button,
  Icon,
  InputNumber,
  Input,
  Row,
  Col,
  Card,
  Avatar,
  Menu,
  Divider,
  Breadcrumb,
  Spin,
  Layout
} from 'antd'
import { Switch, Route, Link, withRouter } from 'react-router-dom'

import 'react-image-gallery/styles/css/image-gallery.css'

import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'

import MainPage from 'components/MainPage'
import Header from 'components/Header';
import Footer from 'components/Footer';
import reducer from './reducer'
import saga from './saga'

const SubMenu = Menu.SubMenu

const LoadSpinner =
  <div
    className="example"
    style={{
      textAlign: 'center',
      background: 'grba(0,0,0,0.05)',
      borderRadius: '4px',
      padding: '30px 50px',
      margin: '20px 0',
      marginBottom: '20px',
    }}
  >
    <Spin size="large" />
  </div>
export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  state = {
  }
  componentDidMount() {
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    })
  }

  render() {
    return (
      <Fragment>
        <article>
          <Helmet>
            <title>Home Page</title>
            <meta name="description" content="SeunghunLee Software" />
          </Helmet>
        </article>
        <Header
          className="header"
        />
        <Layout.Content className="app-layout-content">
          <Switch>
            <Route exact path="/" component={MainPage} />
          </Switch>
        </Layout.Content>
        <Footer />
      </Fragment>
    )
  }
}

HomePage.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

const withReducer = injectReducer({ key: 'post', reducer })
const withSaga = injectSaga({ key: 'post', saga })

export default withRouter(
  compose(withReducer, withSaga, withConnect)(HomePage)
)
