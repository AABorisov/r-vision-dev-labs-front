import React from 'react';
import { Layout } from 'antd';

const { Content, Sider } = Layout;

import classes from './Wrapper.module.scss';
import { PopupFileUploadProvider } from '../../contexts/PopupUploadContext';
import { PageHeader } from './Header';
import { Nav } from './Nav';

interface IProps {
    children: any;
}

const Wrapper = ({ children }: IProps) => {
    return (
        <PopupFileUploadProvider>
            <Layout className={classes.container}>
                <Sider width={75}>
                    <Nav />
                </Sider>
                <Content>
                    <Layout>
                        <PageHeader />
                        <Content
                            style={{
                                minHeight: 'calc(100vh - 64px)',
                                height: 'calc(100vh - 64px)',
                                maxHeight: 'calc(100vh - 64px)',
                                overflow: 'auto',
                            }}
                        >
                            {children}
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </PopupFileUploadProvider>
    );
};

export default Wrapper;
