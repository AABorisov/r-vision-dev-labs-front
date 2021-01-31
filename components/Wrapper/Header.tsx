import React, { useContext } from 'react';
import { Button, Row, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Header } = Layout;
import { PopupUploadContext } from '../../contexts/PopupUploadContext';

export const PageHeader = () => {
    const { toggle } = useContext(PopupUploadContext);

    const onAddDocument = () => {
        toggle!();
    };

    return (
        <Header
            style={{
                backgroundColor: 'white',
            }}
        >
            <Row
                justify="space-between"
                align="middle"
                style={{
                    margin: '12px 0',
                }}
            >
                <div className="empty" />
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onAddDocument}>
                    Добавить документ
                </Button>
            </Row>
        </Header>
    );
};
