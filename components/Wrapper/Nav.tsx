import React, { useContext } from 'react';
import { Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PopupUploadContext } from '../../contexts/PopupUploadContext';

export const Nav = () => {
    const { toggle } = useContext(PopupUploadContext);

    const onAddDocument = () => {
        toggle!();
    };

    return (
        <Menu mode="inline">
            <Menu.Item
                key="0"
                style={{
                    height: 52,
                }}
            >
                Logo
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">Dashboard</Menu.Item>
            <Menu.Item key="2">File</Menu.Item>
            <Menu.Item key="+" onClick={onAddDocument}>
                <PlusOutlined />
            </Menu.Item>
        </Menu>
    );
};
