import React from 'react';
import { Table } from 'antd';
import Card from '../../Cards/Card';
import { INlpTableRow } from '../../../interfaces';

interface IProps {
    data: INlpTableRow[];
    documentTitle: string;
}

const columns = [
    {
        title: 'Attribute',
        dataIndex: 'attribute_name',
    },
    {
        title: 'Value',
        dataIndex: 'attribute_value',
    },
];

const NlpTable = ({ data, documentTitle }: IProps) => {
    const onChange = () => {
        console.log('123');
    };

    return (
        <Card title={documentTitle}>
            <div style={{ overflowX: 'scroll' }}>
                <Table columns={columns} dataSource={data} onChange={onChange} />
            </div>
        </Card>
    );
};

export default NlpTable;
