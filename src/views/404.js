import React, { Component } from 'react'
import { Layout } from 'element-react'
import './404.css'

class NoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Layout.Row>
        <Layout.Col span="24">
          <div className="page-tip">Page Not Found</div>
        </Layout.Col>
      </Layout.Row>
    )
  }
}

export default NoPage
