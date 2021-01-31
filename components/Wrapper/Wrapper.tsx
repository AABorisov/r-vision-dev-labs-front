import {Button, Layout, Menu, Row} from "antd";

const { Content, Sider, Header } = Layout;

import classes from './Wrapper.module.scss';
import {PlusOutlined} from "@ant-design/icons";

const Wrapper: React.FC = ({ children }) => {
  return (
    <Layout className={classes.container}>
      <Sider width={75}>
        <Menu
          mode="inline"
        >
          <Menu.Item key="0" style={{
            height: 52
          }}>Logo</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">File</Menu.Item>
          <Menu.Item key="+"><PlusOutlined /></Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <Layout>
            <Header style={{
              backgroundColor: 'white'
            }}>
              <Row justify='space-between' align='middle' style={{
                margin: '12px 0'
              }}>
                <div className="empty"/>
                <Button type="primary" icon={<PlusOutlined />} size='large'>
                  Добавить документ
                </Button>
              </Row>
            </Header>
            <Content
              style={{
                minHeight: 'calc(100vh - 64px)',
                height: 'calc(100vh - 64px)',
                maxHeight: 'calc(100vh - 64px)',
                overflow: "auto"
              }}>
                {children}
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Wrapper;
