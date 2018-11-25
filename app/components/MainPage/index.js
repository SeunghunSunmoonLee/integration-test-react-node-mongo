import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card } from 'antd'
import axios from 'axios'
import { Table, Button, Popconfirm, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import feathers from 'components/feathers';
import './index.css'

class MainPage extends React.Component {
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
    // this.posts = client.service(`${this.props.match.url.split('/')[1]}/${this.props.match.url.split('/')[2]}`);
    this.grades = [
      {
        key: '1',
        subject: 'Math',
        fullName: 'Seunghun Lee',
        username: 'SeunghunLee',
        grade: 'A',
        date: '2018-10-05',
      },
      {
        key: '2',
        subject: 'Physics',
        fullName: 'Seunghun Lee',
        username: 'SeunghunLee',
        grade: 'A',
        date: '2018-10-05',
      },
      {
        key: '3',
        subject: 'Computer Networking',
        fullName: 'Seunghun Lee',
        username: 'SeunghunLee',
        grade: 'A',
        date: '2018-10-05',
      },
      {
        key: '4',
        subject: 'Math',
        fullName: 'test student',
        username: 'test-student',
        grade: 'A',
        date: '2018-10-05',
      },
      {
        key: '5',
        subject: 'Physics',
        fullName: 'test student',
        username: 'test-student',
        grade: 'A',
        date: '2018-10-05',
      },
      {
        key: '6',
        subject: 'Computer Networking',
        fullName: 'test student',
        username: 'test-student',
        grade: 'A',
        date: '2018-10-05',
      },
    ]

    const usersPage = await feathers.service('users').find({query: {
      $sort: {createdAt: -1},
      $limit: 25
    }})
    const users = usersPage.data

    const studentTableData = this.props.user.profile ? this.grades.filter(grade => grade.username.toLowerCase()=== this.props.user.profile.username.toLowerCase()) : null
    const professorTableData = this.grades

    this.setState({users, studentTableData, professorTableData})
  }

  componentDidUpdate(prevProps, prevState) {
    // user signed out or changed
    if (this.props.user.profile && prevProps.user.profile !== this.props.user.profile) {
      const studentTableData = this.grades.filter(grade => grade.username.toLowerCase()=== this.props.user.profile.username.toLowerCase())
      const professorTableData = this.grades
      this.setState({studentTableData, professorTableData})
    }
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }
  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    })
  }
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    })
  }

  async deletePost(postKey) {
    let tableData = []
    let promises = []
    let updates = {}
    // this.posts.remove(id, params)
  }
  render() {
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    let columns = [
        {
          title: 'Subject',
          dataIndex: 'subject',
          key: 'subject',
          filteredValue: filteredInfo.subject || null,
          onFilter: (value, record) => record.subject.includes(value),
          sorter: (a, b) => a.subject.length - b.subject.length,
          sortOrder: sortedInfo.columnKey === 'subject' && sortedInfo.order,
        },
        {
          title: 'Full Name',
          dataIndex: 'fullName',
          key: 'fullName',
          render: (text, record, index) => (
            <div>{text}</div>
          ),
          filteredValue: filteredInfo.title || null,
          onFilter: (value, record) => record.title.includes(value),
          sorter: (a, b) => a.title.length - b.title.length,
          sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        },

        {
          title: 'Grade',
          dataIndex: 'grade',
          key: 'grade',
          filteredValue: filteredInfo.author || null,
          onFilter: (value, record) => record.grade.includes(value),
          sorter: (a, b) => a.grade.length - b.grade.length,
          sortOrder: sortedInfo.columnKey === 'grade' && sortedInfo.order,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          filters: [
            { text: 'London', value: 'London' },
            { text: 'New York', value: 'New York' },
          ],
          filteredValue: filteredInfo.date || null,
          onFilter: (value, record) => record.date.includes(value),
          sorter: (a, b) => a.date.length - b.date.length,
          sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
        },
      ]
    if(this.props.user.profile && this.props.user.profile.roles.includes("student")) {
      return (
        <Fragment>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }} style={{textAlign: 'center'}}>
              <h1>Grades - Student View</h1>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }}>
              <Table
                columns={columns}
                dataSource={this.state.studentTableData}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Fragment>
      )
    }
    if(this.props.user.profile && this.props.user.profile.roles.includes("professor")) {
      return (
        <Fragment>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }} style={{textAlign: 'center'}}>
              <h1>Grades - Professor View</h1>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }}>
              <Table
                columns={columns}
                dataSource={this.state.professorTableData}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Fragment>
      )
    }
    if(!this.props.user.profile) {
      return (
        <Row type="flex" justify="center">
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }} style={{textAlign: 'center'}}>
            <h1>Please Log in to see grades.</h1>
          </Col>
        </Row>
      )
    }
    return (
      <Row type="flex" justify="center">
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 14, offset: 0 }} style={{textAlign: 'center'}}>
          <h1>Loading</h1>
        </Col>
      </Row>
    )
  }
}

MainPage.defaultProps = {
}

MainPage.propTypes = {
}

const mapStateToProps = state => ({
  user: state.global.user
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainPage))
