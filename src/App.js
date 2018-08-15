import { Breadcrumb, Col, Icon, Layout, Menu, Row } from "antd";
import React from "react";
import { Link, Route, Switch, withRouter, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { LoadingContainer } from "drizzle-react-components";
import styled from "react-emotion";

import Dashboard from "./components/Dashboard";
import Manage from "./components/Manage";
import Schedule from "./components/Schedule";
import ScheduleCalendarPicker from "./components/Schedule/ScheduleCalendarPicker";

const { Header, Content, Footer } = Layout;

const styles = {};

const App = props => {
  const breadcrumbNameMap = {
    "/about": "About",
    "/calendars": "Calendars",
    "/meet": "Schedule",
  };

  const { className, location } = props;
  const pathSnippets = location.pathname.split("/").filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const breadcrumb = breadcrumbNameMap[url];
    return (
      breadcrumb && (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumb}</Link>
        </Breadcrumb.Item>
      )
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className={className}>
      <Layout className="layout">
        <Header>
          {/* <div className="logo" /> */}
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="dashboard">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="calendars">
              <Link to="/calendars">Calendars</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <a
                href="https://medium.com/@saurfang"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbItems}
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 24, minHeight: 64 }}>
            <LoadingContainer>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/calendars" component={Manage} />
                <Route path="/meet/:id" component={Schedule} />
                <Redirect from="/meet" to="/" />
                <Route path="/:account" component={ScheduleCalendarPicker} />
              </Switch>
            </LoadingContainer>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Row>
            <Col span={8}>
              MeetETH: Proof of Concept of{" "}
              <a
                href="https://github.com/ethereum/EIPs/issues/809"
                target="_blank"
                rel="noopener noreferrer"
              >
                ERC809
              </a>
              /
              <a
                href="https://github.com/ethereum/EIPs/issues/1201"
                target="_blank"
                rel="noopener noreferrer"
              >
                ERC1201
              </a>
            </Col>
            <Col span={8} />
            <Col span={8}>
              <a
                href="https://github.com/saurfang/meeteth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="github" /> github
              </a>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </div>
  );
};

App.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(withRouter(App))(styles);
