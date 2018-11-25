import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import uuid from 'uuid/v4'
import { connect } from 'react-redux';
import axios from 'axios'
// import WAValidator from 'wallet-address-validator'   // for other coin address validation
import web3 from 'web3';
const voucher_codes = require('voucher-code-generator');
import feathers from 'components/feathers'
import {
  Spin,
  Row,
  Col,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Checkbox,
  Button,
  AutoComplete,
  Upload,
  Modal,
} from 'antd'
import './style.css'

const FormItem = Form.Item
const Option = Select.Option;

import { signIn, SetSignUpModalVisible } from 'containers/App/actions';


const roles = [
  {
    value: 'undergraduate',
    label: 'undergraduate student',
  },
  {
    value: 'graduate',
    label: 'graduate student',
  },
  {
    value: 'laboratory',
    label: 'laboratory employee',
  },
  {
    value: 'alumni',
    label: 'alumni',
  },
  {
    value: 'public',
    label: 'public',
  },
]

class SignUpForm extends Component {
  state = {
    confirmDirty: false,
    isRegistering: false,
    isUploading: false,
    progress: 0,
    picture: null,
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url:
          'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ isRegistering: true })
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let data = {
          username: values.username,
          email: values.email,
          phone: values.phone,
          password: values.password,
          roles: values.roles,
          countryCode: values.countryCode,

          walletAddress: values.walletAddress || '',
          referralCode: values.referralCode || '',
        }
        try {
          const userRegisterResponse = await feathers.service('users').create(data);
          console.log("userRegisterResponse", userRegisterResponse)
          this.setState({ isRegistering: false })



          feathers.authenticate({
                strategy: 'local',
                email: values.email, password: values.password
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
                 console.log("===user", user)
                 this.props.SetSignUpModalVisible(false)

                 this.props.signIn(user);
               })
               .catch(error => {
                 console.error('===Error authenticating!', error);
                 this.setState({ error })
               });



          // this.props.SetSignUpModalVisible(false)
          this.props.form.resetFields()
          this.props.history.push('/')
        } catch (error) {
          console.log("userRegisterResponse error", error)
          this.setState({ isRegistering: false, error })
        }

      }
      if (err) {
        this.setState({ isRegistering: false })
      }
    })
  }
  validateCountryCode = (rule, value, callback) => {
    const form = this.props.form
    const coutryCodeFormat = /^(\d{1,4})$/i

    if(!coutryCodeFormat.test(value)) {
      callback('Incorrect country code. Number only');
    } else {
      callback()
    }
  }
  validatePhone = (rule, value, callback) => {
    const form = this.props.form
    const phoneFormat = /^(\d{10,})$/i

    if(!phoneFormat.test(value)) {
      callback('Incorrect phone number. Number only without spaces or special characters.');
    } else {
      callback()
    }
  }
  validateUsername = (rule, value, callback) => {
    const form = this.props.form
    const usernameFormat = /^[-_a-zA-Z0-9\u4e00-\u9eff]{4,32}$/i

    if(!usernameFormat.test(value)) {
      callback('You can choose 4 to 32 characters, _, -, numbers');
    } else {
      callback()
    }
  }
  validatePassword = (rule, value, callback) => {
    const form = this.props.form
    const format = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{6,}$/i
    if(!format.test(value)) {
      callback('Minimum 6 characters, with at least 1 numeral character');
    } else {
      callback()
    }
  }
  validateWalletAddress = (rule, value, callback) => {
    const form = this.props.form
    if(value) {
      var valid = web3.utils.isAddress(value);
      if(valid)
          callback()
      else
          callback('It is an INVALID ethereum wallet address');
    } else {
      callback()
    }
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }
  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  hasErrors(fieldsError) {
    if (this.state.isRegistering) {
      fieldsError = Object.assign(fieldsError, {
        isRegistering: ['Registering your account'],
      })
    }
    return Object.keys(fieldsError).some(field => fieldsError[field])
  }
  render() {

    const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form
    console.log("===Form Value", getFieldsValue())
    console.log("===Form Error", getFieldsError())
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const prefixSelector = getFieldDecorator('countryCode', {
      rules: [
        { required: false, message: 'Please input country code. Number only.' },
        {
          // validator: this.validateCountryCode,
        },
      ],
    })(
      <Input
        prefix='+'
        style={{ width: 70 }} />
    );

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <p style={{ fontSize: '34px', textAlign: 'center' }}>Sign Up</p>
        <FormItem
          {...formItemLayout}
          label="Username"
        >
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please type your username!',
                whitespace: true,
              },
              {
                validator: this.validateUsername,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="E-mail">
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
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please input your Password!' },
              {
                validator: this.validatePassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Confirm Password">
          {getFieldDecorator('passwordConfirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              onBlur={this.handleConfirmBlur}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Roles"
        >
          {getFieldDecorator('roles', {
            rules: [
              { required: true, message: 'Please input your roles' },
            ],
          })(
            <Select
              mode="multiple"
              showSearch
              style={{ width: 200 }}
              placeholder="Select roles"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="student">Student</Option>
              <Option value="professor">Professor</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [
              { required: false, message: 'Please input your phone number!' },
              {
                // validator: this.validatePhone,
              },
            ],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Wallet Address"
        >
          {getFieldDecorator('walletAddress', {
            rules: [
              {
                required: false,
                message: 'Please type your wallet address!',
                whitespace: true,
              },
              {
                validator: this.validateWalletAddress,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Referral Code"
        >
          {getFieldDecorator('referralCode', {
            rules: [
              {
                required: false,
                message: 'Please type your referral code!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={
              this.hasErrors(getFieldsError()) ||
              this.state.isRegistering
            }
          >
            Register
          </Button>
          {this.state.isRegistering && <Spin />}
        </FormItem>
        {this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p>}
      </Form>
    )
  }
}

SignUpForm = withRouter(Form.create()(SignUpForm))

class SignUpModal extends React.PureComponent {
  componentDidMount() {

  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Fragment>
        <Modal
          wrapClassName="vertical-center-modal"
          visible={this.props.SignUpModalVisible}
          onOk={() => this.props.SetSignUpModalVisible(false)}
          onCancel={() => this.props.SetSignUpModalVisible(false)}
          footer={null}
        >
          <Row
            type="flex"
            justify="center"
            align="middle"
            style={{
              minHeight: '670px',
            }}
          >
            <Col
              style={{ padding: '10px' }}
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 24, offset: 0 }}
            >
              <SignUpForm
                {...this.props}
              />
            </Col>
          </Row>
        </Modal>
      </Fragment>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    SignUpModalVisible: state.global.SignUpModalVisible,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    SetSignUpModalVisible: (value) => dispatch(SetSignUpModalVisible(value)),
    signIn: (user) => dispatch(signIn(user)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUpModal));
