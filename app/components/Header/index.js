import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Sider, Row, Col, Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scaleRotate as BurgerMenu }  from 'react-burger-menu';

// import feathers from 'components/feathers'
import { SetSignInModalVisible, SetSignUpModalVisible, SetAccountModalVisible, SetVerifyEmailModalVisible, signIn, signOut } from 'containers/App/actions';
import messages from './messages';
import './style.css';

class Header extends React.PureComponent {
  state = {
    isOpen: false,
    windowHeight: undefined,
    windowWidth: undefined,
    collapsed: true,
  };
  show() {
    this.setState({collapsed : false});
  }
  handleResize = () => this.setState({
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  });

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
    const installGoogleAds = () => {
      const elem = document.createElement('script');
      // elem.rel = "stylesheet";
      elem.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      elem.async = true;
      elem.defer = true;
      document.body.insertBefore(elem, document.body.firstChild);
    };
    // installGoogleAds();
    // (adsbygoogle = window.adsbygoogle || []).push({});
    // (window.adsbygoogle = window.adsbygoogle || []).push({
    //   google_ad_client: 'ca-pub-2151301166105861',
    //   enable_page_level_ads: true,
    // });
  }
  openNav = () => {
    this.setState({ isOpen: true })
  }

  closeNav = () => {
    this.setState({ isOpen: false })
  }

  onToggle = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onClickSignUp = () => {
    this.closeNav();
    this.props.SetSignUpModalVisible(true);
  }

  onClickSignIn = () => {
    this.closeNav();
    this.props.SetSignInModalVisible(true);
  }
  render() {
    // <div className="header-children">
    if(!this.state.windowWidth) {
      return <h1>loading</h1>
    }
    if(this.state.windowWidth < 750) {
      return (
        <Fragment>
          <BurgerMenu right>
            <Layout.Header className="header" style={{padding: '0px'}}>
              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={['home']}
                defaultOpenKeys={['/service', '/post']}
                selectedKeys={[this.props.location.pathname]}
                // className="header-menu"
                style={{ display: 'flex', flexDirection: 'column',}}
              >
                <Menu.Item key="home">
                  <Link to="/">
                    <FormattedMessage {...messages.home} />
                  </Link>
                </Menu.Item>
                { !this.props.user.signedIn &&
                  <Menu.Item
                    key="signIn"
                    onClick={this.onClickSignIn}
                  >
                    Log in
                  </Menu.Item>
                }
                {this.props.user.signedIn &&
                  <Menu.Item key="signOut">
                    <Link onClick={() => this.props.signOut()} to="/">
                      Sign Out
                    </Link>
                  </Menu.Item>
                }
              </Menu>
            </Layout.Header>
          </BurgerMenu>
          <Row type="flex" justify="center" style={{textAlign: 'center', lineHeight: '64px'}}>
            <Col
              xs={{ span: 2, offset: 0 }}
              sm={{ span: 2, offset: 0 }}
              md={{ span: 2, offset: 0}}
              lg={{ span: 2, offset: 0 }}
              xl={{ span: 2, offset: 0 }}
              xxl={{ span: 2, offset: 0 }}
            >

            </Col>
            <Col
              xs={{ span: 20, offset: 0 }}
              sm={{ span: 20, offset: 0 }}
              md={{ span: 20, offset: 0}}
              lg={{ span: 20, offset: 0 }}
              xl={{ span: 20, offset: 0 }}
              xxl={{ span: 20, offset: 0 }}
            >
              <Link to="/" style={{fontFamily: 'karla', color: 'inherit', fontSize: '33px', fontWeight: '400'}}>
                Grades
              </Link>
            </Col>
            <Col
              xs={{ span: 2, offset: 0 }}
              sm={{ span: 2, offset: 0 }}
              md={{ span: 2, offset: 0}}
              lg={{ span: 2, offset: 0 }}
              xl={{ span: 2, offset: 0 }}
              xxl={{ span: 2, offset: 0 }}
            >

            </Col>
          </Row>
        </Fragment>
      )
    }
    if(this.state.windowWidth >= 750) {
      return (
        <Fragment>
          <Row type="flex" justify="center" style={{textAlign: 'center', lineHeight: '64px'}}>
            <Col
              xs={{ span: 2, offset: 0 }}
              sm={{ span: 2, offset: 0 }}
              md={{ span: 2, offset: 0}}
              lg={{ span: 2, offset: 0 }}
              xl={{ span: 2, offset: 0 }}
              xxl={{ span: 2, offset: 0 }}
            >

            </Col>
            <Col
              xs={{ span: 20, offset: 0 }}
              sm={{ span: 20, offset: 0 }}
              md={{ span: 20, offset: 0}}
              lg={{ span: 20, offset: 0 }}
              xl={{ span: 20, offset: 0 }}
              xxl={{ span: 20, offset: 0 }}
            >
              <Link to="/" style={{fontFamily: 'karla', color: 'inherit', fontSize: '33px', fontWeight: '400'}}>
                Grades
              </Link>
            </Col>
            <Col
              xs={{ span: 2, offset: 0 }}
              sm={{ span: 2, offset: 0 }}
              md={{ span: 2, offset: 0}}
              lg={{ span: 2, offset: 0 }}
              xl={{ span: 2, offset: 0 }}
              xxl={{ span: 2, offset: 0 }}
            >

            </Col>
          </Row>
          <Row type="flex" justify="center" style={{marginBottom: '20px', textAlign: 'center'}}>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 24, offset: 0}}
              lg={{ span: 22, offset: 0 }}
            >
              <Layout.Header className="header">
                <Menu
                  theme="light"
                  mode="horizontal"
                  defaultSelectedKeys={['home']}
                  selectedKeys={[this.props.location.pathname]}
                  className="header-menu"
                  style={{display: 'flex', justifyContent: 'center'}}
                >
                  <Menu.Item key="home">
                    <Link to="/">
                      <FormattedMessage {...messages.home} />
                    </Link>
                  </Menu.Item>
                  { !this.props.user.signedIn &&
                    <Menu.Item
                      key="signIn"
                      onClick={this.onClickSignIn}
                    >
                      Log in
                    </Menu.Item>
                  }
                  {this.props.user.signedIn &&
                    <Menu.Item key="signOut">
                      <Link onClick={() => this.props.signOut()} to="/">
                        Sign Out
                      </Link>
                    </Menu.Item>
                  }
                </Menu>
              </Layout.Header>
            </Col>
          </Row>
        </Fragment>

      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.global.user,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  signIn: (user) => dispatch(signIn(user)),
  signOut: () => dispatch(signOut()),
  SetSignUpModalVisible: (value) => dispatch(SetSignUpModalVisible(value)),
  SetSignInModalVisible: (value) => dispatch(SetSignInModalVisible(value)),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
