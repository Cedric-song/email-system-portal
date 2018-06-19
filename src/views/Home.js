import React, { Component } from 'react'
import './Home.css'
import { Layout, Form, Input, Button } from 'element-react'
import history from '../history'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    this.refs.form.validate(valid => {
      if (valid) {
        this.submitAction()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  submitAction() {
    if (
      this.state.form.email === 'admin' &&
      this.state.form.password === 'Dr9O$gd#'
    ) {
      sessionStorage.setItem('emailAdmin', 'login')
      history.push('/list')
    }
  }

  onEmailChange(value) {
    this.setState({
      form: Object.assign({}, this.state.form, { email: value })
    })
  }

  onPwdChange(value) {
    this.setState({
      form: Object.assign({}, this.state.form, { password: value })
    })
  }

  render() {
    return (
      <Layout.Row>
        <Layout.Col span="8" offset="8">
          <Form
            ref="form"
            model={this.state.form}
            rules={this.state.rules}
            labelWidth="100"
            className="login-form"
          >
            <Form.Item prop="email" label="用户名">
              <Input
                value={this.state.form.email}
                onChange={this.onEmailChange.bind(this)}
              />
            </Form.Item>
            <Form.Item prop="password" label="密码">
              <Input
                type="password"
                value={this.state.form.password}
                onChange={this.onPwdChange.bind(this)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={this.handleSubmit.bind(this)}
                style={{ width: '100%' }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Layout.Col>
      </Layout.Row>
    )
  }
}

export default Home
