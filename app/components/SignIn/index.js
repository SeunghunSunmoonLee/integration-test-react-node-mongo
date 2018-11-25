import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Divider, Row, Col, Form, Icon, Input, Button, Checkbox, Modal, Spin } from 'antd';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import axios from 'axios'
import feathers from 'components/feathers'
// import { PasswordForgetLink } from '../ForgotPassword';
import './style.css';
import GoogleIcon from './GoogleIcon.svg'
import FacebookIcon from './FacebookIcon.svg'
const FormItem = Form.Item;
import { SetTwoFactorMethod, SetTWoFactorQRCode, SetTwoFactorModalVisible, SetSignInModalVisible, signIn, SetSignUpModalVisible, SetUserId } from '../../containers/App/actions';
class ForgotPasswordForm extends Component {
  state = {
    email: '',
    password: '',
    error: null,
    forgotPassword: false,
    isLoading: false,
  };
  forgotPassword = e => {
    e.preventDefault();
    const { SetSignInModalVisible, signIn, history } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /**
         * Passport Mongodb authentication
         */
        this.setState({isLoading: true})
         axios
     			.post('/auth/forgotPassword', {
     				email: values.email,
     			})
     			.then((response) => {
            console.log("response", response)
     				if (!response.data.error) {
     					// update the state
              // signIn(response.data.user);
              // SetSignInModalVisible(false);
              // this.props.form.resetFields()
              // this.setState({ error: null })
              // history.push('/');
              this.setState({isLoading: false, message: response.data.msg})
              setTimeout(() => {
                this.setState({ message: null });
              }, 4000);
     				} else {
              this.setState({isLoading: false, error: response.data.error })
              setTimeout(() => {
                this.setState({ error: null });
              }, 4000);
            }
     			})
      }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { history } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };
  hasErrors(fieldsError) {
    if (this.state.isLoading) {
      fieldsError = Object.assign(fieldsError, {
        isLoading: ['Requesting'],
      })
    }
    return Object.keys(fieldsError).some(field => fieldsError[field])
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <p style={{ fontSize: '34px', textAlign: 'center' }}>Forgot Password</p>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please input your email!' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            // htmlType="submit"
            className="login-form-button"
            onClick={this.forgotPassword}
            disabled={
              this.hasErrors(getFieldsError()) ||
              this.state.isLoading
            }
          >
            Send Email
          </Button>
        </FormItem>
        {this.state.isLoading && <Spin />}
        {this.state.message && <p style={{whiteSpace: 'normal', color: 'blue', fontSize: '18px'}}>{this.state.message}</p>}
        {this.state.error && <p style={{whiteSpace: 'normal', color: 'red', fontSize: '18px'}}>{this.state.error}</p>}
      </Form>
    );
  }
}
ForgotPasswordForm = withRouter(Form.create()(ForgotPasswordForm));

class TwoFactorSignInForm extends Component {
  state = {
    email: '',
    password: '',
    error: null,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { SetTwoFactorModalVisible, SetSignInModalVisible, signIn, history } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /**
         * Passport Mongodb authentication
         */

         axios
     			.post('/auth/twoFactorLogin', {
     				code: values.userToken,
            _id: this.props.userId
     			})
     			.then((response) => {
     				if (!response.data.error) {
     					// update the state
              signIn(response.data.user);
              SetTwoFactorModalVisible(false);
              SetSignInModalVisible(false);
              this.props.form.resetFields()
              this.setState({ error: null })
              history.push('/');
     				} else {
              this.setState({ error: response.data.error })
            }
     			})
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userToken', {
            rules: [
              {
                message: 'The input is not valid userToken',
              },
              { required: true, message: 'Please input your userToken!' },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Google Authenticator Token"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Submit
          </Button>
        </FormItem>
        {this.state.message && <p style={{color: 'red', fontSize: '18px'}}>{this.state.message}</p>}
        {this.state.error && <p style={{color: 'red', fontSize: '18px'}}>{this.state.error.message}</p>}
      </Form>
    );
  }
}
TwoFactorSignInForm = withRouter(Form.create()(TwoFactorSignInForm));

class TwoFactorSignInModal extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  state = {
  }
  render() {
      return (
        <Fragment>
          <Modal
            wrapClassName="vertical-center-modal"
            visible={this.props.TwoFactorModalVisible}
            onOk={() => this.props.SetTwoFactorModalVisible(false)}
            onCancel={() => this.props.SetTwoFactorModalVisible(false)}
            footer={null}
          >
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{
              minHeight: '500px',
            }}
          >
            <Col
              style={{ padding: '10px' }}
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 20, offset: 0 }}
            >
              { this.props.twoFactorMethod == 'googleAuthenticator' &&
                <Fragment>
                  <p style={{ fontSize: '28px', textAlign: 'center' }}>Two Factor Authentication</p>
                  <p>Downlaod Google Authenticator App on your mobile
                  and scan the QRCode and enter the code to sign in</p>
                  <img src={this.props.twoFactorQRCode} />
                </Fragment>
              }
              { this.props.twoFactorMethod == 'textMessage' &&
                <Fragment>
                  <p style={{ fontSize: '28px', textAlign: 'center' }}>SMS Two Factor Authentication</p>
                  <p>Check your phone for the code sent via text message</p>
                </Fragment>
              }
              <TwoFactorSignInForm
                SetTwoFactorModalVisible={this.props.SetTwoFactorModalVisible}
                SetSignInModalVisible={this.props.SetSignInModalVisible}
                signIn={this.props.signIn}
                userId={this.props.userId}
                twoFactorMethod={this.props.twoFactorMethod}
              />
            </Col>
          </Row>
          </Modal>
        </Fragment>
      )
  }
}
const mapStateToProps2 = (state, ownProps) => {
  return {
    SignInModalVisible: state.global.SignInModalVisible,
    TwoFactorModalVisible: state.global.TwoFactorModalVisible,
    twoFactorQRCode: state.global.twoFactorQRCode,
    twoFactorMethod: state.global.twoFactorMethod,
    currentUser: state.global.currentUser,
    userId: state.global.userId,
  }
}

const mapDispatchToProps2 = (dispatch, ownProps) => {
  return {
    dispatch,
    signIn: (value) => dispatch(signIn(value)),
    SetTwoFactorModalVisible: (value) => dispatch(SetTwoFactorModalVisible(value)),
    SetSignInModalVisible: (value) => dispatch(SetSignInModalVisible(value)),
    SetSignUpModalVisible: (value) => dispatch(SetSignUpModalVisible(value)),
  }
}
TwoFactorSignInModal = withRouter(connect(mapStateToProps2, mapDispatchToProps2)(TwoFactorSignInModal));
export {TwoFactorSignInModal}

export class SignInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: null,
      forgotPassword: false,
    };
    this.loginGoogle = this.loginGoogle.bind(this)
    this.loginFacebook = this.loginFacebook.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
  }

  handleSubmit = e => {
    e.preventDefault();
    const { SetSignInModalVisible, signIn, history } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /**
         * Passport Mongodb authentication
         */
         feathers.authenticate({
               strategy: 'local',
               email: values.email,
               password: values.password,
             })
              .then(response => {
               console.log('===Authenticated!', response);
               return feathers.passport.verifyJWT(response.accessToken);
              })
              .then(payload => {
                console.log('===JWT Payload', payload);
                console.log("===user_id",payload.userId)
                 return feathers.service('users').get(payload.userId);
              })
              .then(user => {
                feathers.set('user', user);
                this.props.signIn(user);
                this.props.SetSignInModalVisible(false);
                this.props.form.resetFields()
                this.setState({ error: null })
              })
              .catch(error => {
                console.error('===Error authenticating!', error);
                this.setState({ error })
              });

         // axios
     			// .post('/auth/login', {
     			// 	email: values.email,
     			// 	password: values.password
     			// })
     			// .then((response) => {
         //    console.log("response", response)
     			// 	if (!response.data.error) {
         //      if(response.data.twoFactorEnabled == true) {
         //        console.log("SetTwoFactorModalVisible response.data.twoFactorEnabled", response.data.twoFactorEnabled)
         //        this.props.SetTwoFactorModalVisible(true)
         //        this.props.SetTWoFactorQRCode(response.data.twoFactorQRCode)
         //        this.props.SetTwoFactorMethod(response.data.twoFactorMethod)
         //        this.props.SetUserId(response.data._id)
         //      } else {
         //        // succesfully logged in.
         //        signIn(response.data.user);
         //        SetSignInModalVisible(false);
         //        this.props.form.resetFields()
         //        this.setState({ error: null })
         //        history.push('/');
         //      }
     			// 		// update the state
     			// 		// if(response.data.user.twoFactorEnabled) {
         //      //   SetTwoFactorModalVisible(true)
         //      // }
         //
     			// 	} else {
         //
         //      this.setState({ error: response.data.error })
         //    }
     			// })
      }
    });
  };

  onClickSignUp = () => {
    const { SetSignInModalVisible, SetSignUpModalVisible } = this.props;
    SetSignInModalVisible(false);
    SetSignUpModalVisible(true);
  }
  async loginFacebook() {
    try {
      // const result = await axios.get('/auth/facebook')
      // console.log("result", result)
      window.location.href = `${window.location.origin}/auth/facebook`



      // return client.authenticate({})
      //  .then(response => {
      //   console.log('===Authenticated!', response);
      //   return client.passport.verifyJWT(response.accessToken);
      //  })
      //  .then(payload => {
      //    console.log('===JWT Payload', payload);
      //    console.log("===user_id",payload.userId)
      //     return client.service('users').get(payload.userId);
      //  })
      //  .then(user => {
      //    client.set('===user', user);
      //  })
      //  .catch(function(error){
      //    console.error('===Error authenticating!', error);
      //    this.setState({ login: null })
      //  });


    }
    catch(e) {
      console.log("loginFacebook error", e)
    }
  }
  async loginGoogle() {
    try {
      // const result = await axios.get('/auth/google')
      // console.log("result", result)
      window.location.href = `${window.location.origin}/auth/google`
    }
    catch(e) {
      console.log("loginFacebook error", e)
    }
  }
  forgotPassword() {
    this.setState((prevState, props) => {
      return {forgotPassword: !prevState.forgotPassword};
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Button
          type="primary"
          onClick={this.loginFacebook}
          className="login-form-button login-form-button-facebook"
        >
          <img src={FacebookIcon} style={{width: '18px', marginRight: '12px'}} /> Continue with Facebook
        </Button>
        <br/>
        <Button
          type="primary"
          onClick={this.loginGoogle}
          className="login-form-button login-form-button-google"
        >
          <img src={GoogleIcon} style={{width: '18px', marginRight: '12px'}} />Continue with Google
        </Button>
        <div style={{marginTop: '16px', marginBottom: '16px'}}>
          <div style={{textAlign: 'center', overflow: 'hidden'}}><span className="divider" style={{position: 'relative', padding: '16px'}}><span className="dividerOr">or</span></span></div>
        </div>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please input your email!' },
            ],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox><span style={{fontSize: '16px', marginTop: '5px'}}>Remember me</span></Checkbox>)}
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button login-form-button-local"
        >
          Log in
        </Button>
        <br/>
        <Row
          type="flex"
          justify="center"
          align="middle"
        >
            <a
              style={{ marginTop: '10px', marginBottom: '10px', fontWeight: '600', overflowWrap: 'break-word', fontSize: '16px', lineHeight: '18px', letterSpacing: 'normal', textAlign: 'center', color: 'rgb(0, 132, 137)'}}
              onClick={this.forgotPassword}
            >
              Forgot Password?
            </a>
        </Row>
        <div style={{marginTop: '16px', marginBottom: '16px'}}>
          <div className="divider" style={{textAlign: 'center', overflow: 'hidden'}}></div>
        </div>
        <Row
          type="flex"
          justify="center"
          align="middle"
        >
            <span style={{fontSize: '16px'}}>
              Don't have an account?
              <a
                style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px', fontWeight: '600', overflowWrap: 'break-word', fontSize: '16px', lineHeight: '18px', letterSpacing: 'normal', textAlign: 'center', color: 'rgb(0, 132, 137)'}}
                onClick={this.onClickSignUp}
              >Sign up</a>
            </span>
        </Row>

        {this.state.message && <p style={{color: 'red', fontSize: '18px'}}>{this.state.message}</p>}
        {this.state.error && <p style={{color: 'red', fontSize: '18px'}}>{this.state.error.message}</p>}
      </Form>
    );
  }
}
SignInForm = withRouter(Form.create()(SignInForm));

class SignInModal extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    // this.state = {
    //   forgotPassword: false,
    // }
    // this.forgotPassword = this.forgotPassword.bind(this)
  }

  // forgotPassword() {
  //   this.setState((prevState, props) => {
  //     return {forgotPassword: !prevState.forgotPassword};
  //   });
  // }
  render() {
    return (
      <Fragment>
        <Modal
          wrapClassName="vertical-center-modal"
          visible={this.props.SignInModalVisible}
          onOk={() => this.props.SetSignInModalVisible(false)}
          onCancel={() => this.props.SetSignInModalVisible(false)}
          footer={null}
        >
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{
            minHeight: '500px',
          }}
        >
          <Col
            style={{ padding: '10px' }}
            xs={{ span: 24, offset: 0 }}
            lg={{ span: 20, offset: 0 }}
          >
            <SignInForm
              SetSignInModalVisible={this.props.SetSignInModalVisible}
              SetSignUpModalVisible={this.props.SetSignUpModalVisible}
              SetTwoFactorModalVisible={this.props.SetTwoFactorModalVisible}
              SetTWoFactorQRCode={this.props.SetTWoFactorQRCode}
              SetTwoFactorMethod={this.props.SetTwoFactorMethod}
              SetUserId={this.props.SetUserId}
              signIn={this.props.signIn}
            />
            {/*
              <Fragment>
              <ForgotPasswordForm />
              <Button
                type="primary"
                // htmlType="submit"
                className="login-form-button"
                onClick={this.forgotPassword}
              >
                Back to Account
              </Button>
              </Fragment>
            */}
          </Col>
        </Row>
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    SignInModalVisible: state.global.SignInModalVisible,
    // TwoFactorModalVisible: state.global.TwoFactorModalVisible,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    // SetTwoFactorMethod: (value) => dispatch(SetTwoFactorMethod(value)),
    signIn: (value) => dispatch(signIn(value)),
    // SetTwoFactorModalVisible: (value) => dispatch(SetTwoFactorModalVisible(value)),
    SetSignInModalVisible: (value) => dispatch(SetSignInModalVisible(value)),
    SetSignUpModalVisible: (value) => dispatch(SetSignUpModalVisible(value)),
    // SetTWoFactorQRCode: (value) => dispatch(SetTWoFactorQRCode(value)),
    // SetUserId: (value) => dispatch(SetUserId(value)),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignInModal));
