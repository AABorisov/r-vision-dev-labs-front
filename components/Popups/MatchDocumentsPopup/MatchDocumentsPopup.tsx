import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import mock from '../../../mocks/matchDocuments';

interface IProps {
    title: string;
    isVisible: boolean;
    onCancel: () => void;
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
];

const MatchDocumentsPopup = ({ title, isVisible, onCancel }: IProps) => {
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        setDocuments(mock);
    }, []);

    return (
        <Modal title={title} visible={isVisible} footer={null} onCancel={onCancel}>
            <Table columns={columns} dataSource={documents} />
        </Modal>
    );
};

export default MatchDocumentsPopup;
