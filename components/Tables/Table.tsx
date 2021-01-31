import { Table as AntdTable } from 'antd';
import React from 'react';

interface IProps {
    children: any;
}

const Table = ({ children }: IProps) => {
    return <AntdTable>{children}</AntdTable>;
};

export default Table;
