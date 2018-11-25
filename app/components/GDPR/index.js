import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import uuid from 'uuid/v4'
import { connect } from 'react-redux';
import axios from 'axios'
// import WAValidator from 'wallet-address-validator'   // for other coin address validation
const voucher_codes = require('voucher-code-generator');

import {
  Spin,
  Row,
  Col,
  Form,
  Input,
  Icon,
  Button,
  Modal,
  Checkbox,
} from 'antd'
import './style.css'

const FormItem = Form.Item
import { SetGDPRModalVisible } from '../../containers/App/actions';

class GDPRForm extends Component {
  state = {
    news_ares: false,
    news_game: false,
    news_ico: false,
    tracking: false,
  }

  handleSubmit = e => {
    e.preventDefault()
    const GDPR = this.state;
    axios.post('/auth/gdpr', {
      user: this.props.currentUser._id,
      GDPR
    })
    .then(response => {
        this.setState({ isRegistering: false })
        this.props.SetGDPRModalVisible(false)
        this.props.history.push('/')
      })
    .catch(error => {
      this.setState({ isRegistering: false, error: error.msg })
    })
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
  onChangeHandler = (event, fieldName) => {
    const values = this.state;
    values[fieldName] = event.target.checked;
    this.setState(values);
  }
  render() {

    const { getFieldDecorator, getFieldsError } = this.props.form
    const formItemLayout = {
      wrapperCol: {
        xs: {
          span: 20,
          offset: 2,
        },
        sm: {
          span: 20,
          offset: 2,
        },
      },
    }

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <p style={{ fontSize: '34px', textAlign: 'center' }}>Data Protection</p>
        <FormItem>
          <div>Email Preferences</div>
        </FormItem>
        <FormItem {...formItemLayout}>
          <Checkbox size="large" name="news_ares" onChange={(value) => this.onChangeHandler(value, 'news_ares')}>I would love to receive updates and news about Ares Tech</Checkbox>
        </FormItem>
        <FormItem {...formItemLayout}>
          <Checkbox size="large" name="news_game" onChange={(value) => this.onChangeHandler(value, 'news_game')}>I would love to receive updates about the World Cup game</Checkbox>
        </FormItem>
        <FormItem {...formItemLayout}>
          <Checkbox size="large" name="news_ico" onChange={(value) => this.onChangeHandler(value, 'news_ico')}>I would love to know when Ares will have their Initial Coin Offering</Checkbox>
        </FormItem>
        <FormItem>
          <div>Tracking Preferences</div>
        </FormItem>
        <FormItem {...formItemLayout}>
          <Checkbox size="large" name="tracking" onChange={(value) => this.onChangeHandler(value, 'tracking')}>I’m happy to provide Ares the data about how I use their products so that they can improve them</Checkbox>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            size="large"
            disabled={
              this.hasErrors(getFieldsError()) ||
              this.state.isRegistering
            }
          >
            Submit
          </Button>
          {this.state.isRegistering && <Spin />}
        </FormItem>
        {this.state.error && <p>{this.state.error}</p>}
      </Form>
    )
  }
}

GDPRForm = withRouter(Form.create()(GDPRForm))

class GDPRModal extends React.PureComponent {
  componentDidMount() {

  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Fragment>
        <Modal
          wrapClassName="vertical-center-modal"
          visible={this.props.GDPRModalVisible}
          onOk={() => this.props.SetGDPRModalVisible(false)}
          onCancel={() => this.props.SetGDPRModalVisible(false)}
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
              <GDPRForm
                SetGDPRModalVisible={() => this.props.SetGDPRModalVisible(false)}
                currentUser={this.props.currentUser}
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
    GDPRModalVisible: state.global.GDPRModalVisible,
    currentUser: state.global.currentUser,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    SetGDPRModalVisible: (value) => dispatch(SetGDPRModalVisible(value)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GDPRModal));
