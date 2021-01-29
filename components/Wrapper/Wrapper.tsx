import { Layout, Menu } from "antd";

const { Content, Sider } = Layout;

import classes from './Wrapper.module.scss';

const Wrapper: React.FC = ({ children }) => {
  return (
    <Layout className={classes.container}>
      <Sider width={200}>
        <Menu
          mode="inline"
        >
          <Menu.Item key="1">Пример элемента</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Wrapper;
