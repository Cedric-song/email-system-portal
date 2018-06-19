import React, { Component } from 'react'
import axios from 'axios'
import history from '../history'
import moment from 'moment'

import {
  Layout,
  Table,
  Button,
  Dialog,
  Form,
  Input,
  Switch,
  Message
} from 'element-react'

import './List.css'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
}

class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [
        {
          label: '序号',
          prop: 'ID',
          minWidth: 100
        },
        {
          label: '邮箱地址',
          prop: 'EMAIL',
          minWidth: 300
        },
        {
          label: '订阅状态',
          prop: 'STATUS',
          minWidth: 160,
          render({ STATUS }) {
            return <span>{STATUS === 1 ? '订阅中' : '未订阅'}</span>
          }
        },
        {
          label: '加入时间',
          prop: 'CREATETIME',
          minWidth: 200,
          render({ CREATETIME }) {
            return (
              <span>
                {CREATETIME
                  ? moment(CREATETIME).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </span>
            )
          }
        },
        {
          label: '更新时间',
          prop: 'UPDATETIME',
          minWidth: 160,
          render({ UPDATETIME }) {
            return (
              <span>
                {UPDATETIME
                  ? moment(UPDATETIME).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </span>
            )
          }
        },
        {
          label: '操作',
          minWidth: 200,
          render: row => {
            return (
              <span>
                <Button
                  type="text"
                  size="small"
                  onClick={this.handleEdit.bind(this, row)}
                >
                  编辑
                </Button>

                <Button
                  type="text"
                  size="small"
                  onClick={this.handleDelete.bind(this, row)}
                >
                  删除
                </Button>
              </span>
            )
          }
        }
      ],
      data: [],
      dialogVisible: false,
      newDialogVisible: false,
      deleteDialogVisible: false,
      form: {
        email: '',
        status: ''
      },
      deleteId: ''
    }
  }

  componentDidMount() {
    if (sessionStorage.getItem('emailAdmin') !== 'login') {
      history.push('/404')
      return false
    }
    this.fetchList()
  }

  fetchList() {
    axios.get('/v1/list').then(res => {
      const data = res.data
      if (data.code === 200) {
        this.setState({ data: data.data.list })
      }
    })
  }

  handleEdit(row) {
    const param = {
      email: row.EMAIL,
      status: row.STATUS
    }
    this.setState({ form: Object.assign({}, param) })
    this.setState({ dialogVisible: true })
  }

  handleDelete(row) {
    const param = {
      email: row.EMAIL,
      status: row.STATUS
    }
    this.setState({ form: Object.assign({}, param) })
    this.setState({ deleteId: row.ID })
    this.setState({ deleteDialogVisible: true })
  }

  downloadList() {
    axios.get('/v1/list/download').then(res => {
      const data = res.data
      if (data.code === 200) {
        window.open(data.data.url)
      }
    })
  }

  handleEditConfirm() {
    const url =
      this.state.form.status === 1 ? '/v1/subscribe' : '/v1/unsubscribe'
    const self = this
    axios
      .get(url, { params: { email: this.state.form.email, from: 'api' } })
      .then(res => {
        if (res.data.code === 200) {
          Message.success('修改成功')
          self.fetchList()
        } else {
          Message.error(res.data.msg)
        }

        self.setState({ dialogVisible: false })
      })
  }

  handleDeleteConfirm() {
    const url = '/v1/deleteEmail'
    const self = this
    axios
      .get(url, {
        params: { id: this.state.deleteId }
      })
      .then(res => {
        if (res.data.code === 200) {
          Message.success('删除成功')
          self.fetchList()
        } else {
          Message.error(res.data.msg)
        }

        self.setState({ deleteDialogVisible: false })
      })
  }

  handleNewConfirm() {
    const url = '/v1/addNewEmail'
    const self = this
    axios
      .get(url, {
        params: { email: this.state.form.email, status: this.state.form.status }
      })
      .then(res => {
        if (res.data.code === 200) {
          Message.success('新增成功')
          self.fetchList()
        } else {
          Message.error(res.data.msg)
        }

        self.setState({ newDialogVisible: false })
      })
  }

  handleSwitchChange(value) {
    const param = { status: value }
    this.setState({ form: Object.assign(this.state.form, param) })
  }

  addNew() {
    const param = {
      email: '',
      status: 1
    }
    this.setState({ form: Object.assign({}, param) })
    this.setState({ newDialogVisible: true })
  }

  onChange(key, value) {
    const param = {
      email: value,
      status: this.state.form.status
    }
    this.setState({ form: Object.assign({}, param) })
    this.forceUpdate()
  }

  render() {
    return (
      <div className="email-list">
        <Layout.Row>
          <Layout.Col span="22" offset="1" style={{ padding: '10px 0' }}>
            <Button onClick={() => this.downloadList()}>下载邮箱列表</Button>
            <Button onClick={() => this.addNew()}>新增邮箱</Button>
          </Layout.Col>
          <Layout.Col span="22" offset="1">
            <Table
              style={{ width: '100%' }}
              columns={this.state.columns}
              data={this.state.data}
              border={true}
            />

            <Dialog
              title="编辑邮箱信息"
              visible={this.state.dialogVisible}
              onCancel={() => this.setState({ dialogVisible: false })}
            >
              <Dialog.Body>
                <Form model={this.state.form}>
                  <Form.Item label="邮箱" labelWidth="120">
                    <Input
                      value={this.state.form.email}
                      style={{ width: '200px' }}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item label="订阅状态" labelWidth="120">
                    <Switch
                      value={this.state.form.status}
                      onColor="#13ce66"
                      offColor="#ff4949"
                      onValue={1}
                      offValue={0}
                      onChange={value => this.handleSwitchChange(value)}
                    />
                  </Form.Item>
                </Form>
              </Dialog.Body>

              <Dialog.Footer className="dialog-footer">
                <Button onClick={() => this.setState({ dialogVisible: false })}>
                  取 消
                </Button>
                <Button type="primary" onClick={() => this.handleEditConfirm()}>
                  确 定
                </Button>
              </Dialog.Footer>
            </Dialog>

            <Dialog
              title="新增邮箱信息"
              visible={this.state.newDialogVisible}
              onCancel={() => this.setState({ newDialogVisible: false })}
            >
              <Dialog.Body>
                <Form model={this.state.form}>
                  <Form.Item label="邮箱" labelWidth="120">
                    <Input
                      value={this.state.form.email}
                      style={{ width: '200px' }}
                      onChange={this.onChange.bind(this, 'email')}
                    />
                  </Form.Item>

                  <Form.Item label="订阅状态" labelWidth="120">
                    <Switch
                      value={this.state.form.status}
                      onColor="#13ce66"
                      offColor="#ff4949"
                      onValue={1}
                      offValue={0}
                      onChange={value => this.handleSwitchChange(value)}
                    />
                  </Form.Item>
                </Form>
              </Dialog.Body>

              <Dialog.Footer className="dialog-footer">
                <Button
                  onClick={() => this.setState({ newDialogVisible: false })}
                >
                  取 消
                </Button>
                <Button type="primary" onClick={() => this.handleNewConfirm()}>
                  确 定
                </Button>
              </Dialog.Footer>
            </Dialog>

            <Dialog
              title="删除邮箱"
              visible={this.state.deleteDialogVisible}
              onCancel={() => this.setState({ deleteDialogVisible: false })}
            >
              <Dialog.Body>
                <Form model={this.state.form}>
                  <Form.Item label="邮箱" labelWidth="120">
                    <Input
                      value={this.state.form.email}
                      style={{ width: '200px' }}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item label="订阅状态" labelWidth="120">
                    <Switch
                      value={this.state.form.status}
                      onColor="#13ce66"
                      offColor="#ff4949"
                      onValue={1}
                      offValue={0}
                      disabled
                    />
                  </Form.Item>
                </Form>
              </Dialog.Body>

              <Dialog.Footer className="dialog-footer">
                <Button
                  onClick={() => this.setState({ deleteDialogVisible: false })}
                >
                  取 消
                </Button>
                <Button
                  type="primary"
                  onClick={() => this.handleDeleteConfirm()}
                >
                  确 定
                </Button>
              </Dialog.Footer>
            </Dialog>
          </Layout.Col>
        </Layout.Row>
      </div>
    )
  }
}

export default List
