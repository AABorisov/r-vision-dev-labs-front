import React from 'react';
import { Table } from 'antd';
import Card from '../../Cards/Card';
import { IUploadedTableRow } from '../../../interfaces';

interface IProps {
    data: IUploadedTableRow[];
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        sorter: {
            compare: (a: any, b: any) => a.id - b.id,
        },
    },
    {
        title: 'Документ',
        dataIndex: 'document',
        sorter: {
            compare: (a: any, b: any) => a.document - b.document,
        },
    },
    {
        title: 'Категория',
        dataIndex: 'category',
        sorter: {
            compare: (a: any, b: any) => a.category - b.category,
        },
    },
    {
        title: 'Автор',
        dataIndex: 'author',
        sorter: {
            compare: (a: any, b: any) => a.author - b.author,
        },
    },
    {
        title: 'Дата создания',
        dataIndex: 'creationDate',
        sorter: {
            compare: (a: any, b: any) => a.creationDate - b.creationDate,
        },
    },
];

const Uploaded = ({ data }: IProps) => {
    const onChange = () => {
        console.log(123);
    };

    return (
        <Card title="Uploaded">
            <Table columns={columns} dataSource={data} onChange={onChange} />
        </Card>
    );
};

export default Uploaded;
