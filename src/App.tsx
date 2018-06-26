import { Breadcrumb, Col, Icon, Layout, Menu, Row } from 'antd';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import Dashboard from './Dashboard';
import Manage from './Manage';
import Schedule from './Schedule';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.scss';

const { Header, Content, Footer } = Layout;

class App extends React.Component<RouteComponentProps<any>> {

  public render() {
    const breadcrumbNameMap = {
      '/': 'Dashboard',
    };

    const { location } = this.props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {breadcrumbNameMap[url]}
          </Link>
        </Breadcrumb.Item>
      );
    });

    const breadcrumbItems = [(
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);

    return (
      <div className="App">
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="dashboard">Dashboard</Menu.Item>
              <Menu.Item key="manage">Manage Calendar</Menu.Item>
              <Menu.Item key="about">About</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {breadcrumbItems}
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
              <Switch>
                <Route exact={true} path="/" component={Dashboard} />
                <Route path="/manage" component={Manage} />
                <Route path="/meet/:id" component={Schedule} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <Row>
              <Col span={8}>MeetETH: Proof of Concept of <a href="https://github.com/ethereum/EIPs/issues/809">ERC809</a></Col>
              <Col span={8} />
              <Col span={8}><a href="https://github.com/saurfang/meeteth"><Icon type="github" /> github</a></Col>
            </Row>
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
