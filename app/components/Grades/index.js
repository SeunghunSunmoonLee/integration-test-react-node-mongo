import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card } from 'antd'
import axios from 'axios'
import { Avatar, Divider, List, Button, Popconfirm, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import feathers from 'components/feathers';
import LazyLoad from 'react-lazyload';

import './style.css'

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class UserGrades extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
      tableData: null,
      url: '',
      error: '',
      user: { role: [] },
      tableReady: false,
    }
  }
  async componentDidMount() {
    this.username = this.props.username ? this.props.username : window.location.href.split('@').pop().split('/')[0].toLowerCase()
    const userResponse = await feathers.service('users').find({query: {
      username: this.username,
      $sort: {createdAt: -1},
      $limit: 25
    }})
    this.user = userResponse.data[0]

    const grades = feathers.service('grades')
    const gradesResponse = await feathers.service('grades').find({query: {
      user_id: this.user._id,
      $sort: { updated_at: -1},
      $limit: 25
    }})
    this.grades = gradesResponse.data

    this.setState({user: this.user, grades: this.grades})


    // Add new messages to the message list
    grades.on('created', grade => this.setState((state, props) => {
      console.log("===new grade created", grade, state)
      return ({
        grades: [grade, ...state.grades],
      })
    }));
    grades.on('removed', (grade, context) => this.setState((state, props) => {
      console.log("=== grade removed", grade, state)
      console.log("=== grade removed grades", [...state.grades.splice(state.grades.findIndex(element => element._id === grade._id), 1)], ...state.grades.splice(state.grades.findIndex(element => element._id === grade._id), 1))
      return {
        grades: [...state.grades.splice(state.grades.findIndex(element => element._id === grade._id), 1)]
      }
    }));
    grades.on('updated', (grade, context) => this.setState((state, props) => {
      console.log("===grade updated", grade, state)
      return {
        grades: [...state.grades.splice(state.grades.findIndex(element => element._id === grade._id), 1, grade)]
      }
    }));
    grades.on('patched', (grade, context) => this.setState((state, props) => {
      console.log("===grade patched", grade, state)
      return {
        grades: [...state.grades.splice(state.grades.findIndex(element => element._id === grade._id), 1, grade)]
      }
    }));
  }

  async deletePost(postKey) {
    let tableData = []
    let promises = []
    let updates = {}
    // this.grades.remove(id, params)
  }

  stripHtml(html){
      // Create a new div element
      var temporalDivElement = document.createElement("div");
      // Set the HTML content with the providen
      temporalDivElement.innerHTML = html;
      // Retrieve the text property of the element (cross-browser support)
      return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }
  edit = (item) => {
    console.log("===edit", item)
    // await feathers.service('grades').remove(item._id)
    this.props.history.push(
      `/@${this.username}/post/${encodeURI(item.title)}?id=${item._id}&mode=edit`
    )
  }
  delete = async (item) => {
    await feathers.service('grades').remove(item._id)
  }
  render() {
    console.log("===usergrades this.state, this.state.grades", this.state, this.state.grades)
    if(!this.state.user || !this.state.grades) {
      return <h1 style={{textAlign: 'center', fontSize: '50px'}}>Loading</h1>
    }
    /**
     * own writer view: additional edit, delete functionality
     */
    if(this.user && this.props.user.profile && (this.props.user.profile._id === this.user._id)) {
      return (
        <Fragment>
          {!this.props.withoutUser &&
            <Fragment>
            <Row type="flex" justify="center" style={{paddingTop: '35px', paddingBottom: '10px',}}>
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 12, offset: 0}}
                lg={{ span: 2, offset: 0 }}
                style={{cursor: 'pointer'}}
              >
                <a target="_blank" href="">
                  <img
                    src={this.state.user.facebook.profile.photos[0].value || this.state.user.avatar}
                    style={{width: '60px', height: '60px', borderRadius: '100%'}}
                  />
                </a>
              </Col>
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 12, offset: 0}}
                lg={{ span: 22, offset: 0 }}
                style={{ paddingLeft: "15px", display: 'flex', flexDirection: 'column', alignItems: 'space-between', color: 'rgba(0,0,0,.84)', fontSize: "16px", lineHeight: '20px', fontWeight: '900' }}
              >
                <div style={{}}>{this.state.user.username}</div>
                <div style={{color: 'rgba(0,0,0,.54)'}}>{this.state.user.description || `🎹🎸🕺🏂 Full Stack React, React Native, Machine Learning Developer. Follow me@ SeunghunLee.net instagram: seunghun.sunmoon.lee twitter: seunghunSunmoon`}</div>
                <div style={{color: 'rgba(0,0,0,.54)'}}>Was active on </div>
              </Col>
            </Row>
            <Row
              // beginning of main stories
              type="flex" justify="center"
            >
              <Col
                xs={{ span: 24, offset: 0 }}
                md={{ span: 24, offset: 0}}
                lg={{ span: 24, offset: 0 }}
                // style={{marginRight: '24px'}}
              >
                <Divider />
              </Col>
            </Row>
            </Fragment>
          }
          <Row
            // beginning of main stories
            type="flex" justify="center"
          >
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 24, offset: 0}}
              lg={{ span: 24, offset: 0 }}
              // style={{marginRight: '24px'}}
            >
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    // console.log(page);
                  },
                  pageSize: 10,
                }}
                dataSource={this.state.grades}
                footer={<div><b></b> </div>}
                renderItem={item => (
                  <List.Item
                    key={item.title}
                    actions={[<div>Oct 10</div>, <div>3 min read</div>, <IconText type="star-o" text="" />, <Button onClick={(e) => this.edit(item)}>edit</Button>, <Button onClick={(e) => this.delete(item)}>delete</Button>]}
                    extra={
                      <a
                        style={{
                          backgroundImage: `url(${item.photos.length !== 0 ? item.photos[0].url : 'https://cdn-images-1.medium.com/fit/c/120/120/1*kKs0NR9xjy6vYPdGehYbxQ.jpeg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: "center center",
                          width: '150px',
                          height: '150px',
                          flex: '0 0 auto',
                          display: 'block',
                        }}
                      />
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.user.facebook.profile.photos[0].value || item.user.avatar} />}
                      title={<a style={{fontSize: '24px', fontWeight: '600'}} >{item.title}</a>}
                      description={`${this.stripHtml(item.html.substring(0, 160))}...`}
                    />
                    {item.category.join(' ')}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Fragment>
      )
    }
    return (
      <Fragment>

      </Fragment>
    )
  }
}

UserGrades.defaultProps = {
  authenticated: false,
}

UserGrades.propTypes = {
  authenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
  user: state.global.user
});

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: () => dispatch(dispatchers.signOut())
  }
});
// const authCondition = (authUser) => !!authUser;
// const authCondition = (authUser) => !!authUser && authUser.role === 'ADMIN';

// export default withAuthorization(authCondition)(UserGrades);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserGrades));
