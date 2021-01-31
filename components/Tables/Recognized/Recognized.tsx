import React from 'react';
import { Table } from 'antd';
import Card from '../../Cards/Card';
import { IRecognizedTableRow } from '../../../interfaces';

interface IProps {
    data: IRecognizedTableRow[];
}

const columns = [
    {
        title: 'Document ID',
        dataIndex: 'document_id',
        sorter: {
            compare: (a: any, b: any) => a.document_id - b.document_id,
        },
    },
    {
        title: 'cve',
        dataIndex: 'cve',
        sorter: {
            compare: (a: any, b: any) => a.cve - b.cve,
        },
    },
    {
        title: 'cwe',
        dataIndex: 'cwe',
        sorter: {
            compare: (a: any, b: any) => a.cwe - b.cwe,
        },
    },
    {
        title: 'Software',
        dataIndex: 'software',
        sorter: {
            compare: (a: any, b: any) => a.software - b.software,
        },
    },
    {
        title: 'Malware',
        dataIndex: 'malware',
        sorter: {
            compare: (a: any, b: any) => a.malware - b.malware,
        },
    },
    {
        title: 'Course of action',
        dataIndex: 'course_of_action',
        sorter: {
            compare: (a: any, b: any) => a.course_of_action - b.course_of_action,
        },
    },
    {
        title: 'Intrusion set',
        dataIndex: 'intrusion_set',
        sorter: {
            compare: (a: any, b: any) => a.intrusion_set - b.intrusion_set,
        },
    },
    {
        title: 'Threat actor',
        dataIndex: 'threat_actor',
        sorter: {
            compare: (a: any, b: any) => a.threat_actor - b.threat_actor,
        },
    },
    {
        title: 'Tool',
        dataIndex: 'tool',
        sorter: {
            compare: (a: any, b: any) => a.tool - b.tool,
        },
    },
    {
        title: 'Attack pattern',
        dataIndex: 'attack_pattern',
        sorter: {
            compare: (a: any, b: any) => a.attack_pattern - b.attack_pattern,
        },
    },
    {
        title: 'Industry',
        dataIndex: 'industry',
        sorter: {
            compare: (a: any, b: any) => a.industry - b.industry,
        },
    },
    {
        title: 'Mitre attack',
        dataIndex: 'mitre_attack',
        sorter: {
            compare: (a: any, b: any) => a.mitre_attack - b.mitre_attack,
        },
    },
    {
        title: 'Campaign',
        dataIndex: 'campaign',
        sorter: {
            compare: (a: any, b: any) => a.campaign - b.campaign,
        },
    },
    {
        title: 'Org',
        dataIndex: 'org',
        sorter: {
            compare: (a: any, b: any) => a.org - b.org,
        },
    },
    {
        title: 'Country',
        dataIndex: 'country',
        sorter: {
            compare: (a: any, b: any) => a.country - b.country,
        },
    },
    {
        title: 'City',
        dataIndex: 'city',
        sorter: {
            compare: (a: any, b: any) => a.city - b.city,
        },
    },
    {
        title: 'Geolocation',
        dataIndex: 'geolocation',
        sorter: {
            compare: (a: any, b: any) => a.geolocation - b.geolocation,
        },
    },
    {
        title: 'Time stamp',
        dataIndex: 'time_stamp',
        sorter: {
            compare: (a: any, b: any) => a.time_stamp - b.time_stamp,
        },
    },
    {
        title: 'Ioc',
        dataIndex: 'ioc',
        sorter: {
            compare: (a: any, b: any) => a.ioc - b.ioc,
        },
    },
    {
        title: 'Technique',
        dataIndex: 'technique',
        sorter: {
            compare: (a: any, b: any) => a.technique - b.technique,
        },
    },
];

const Recognized = ({ data }: IProps) => {
    const onChange = () => {
        console.log('123');
    };

    return (
        <Card title="Recognized">
            <div style={{ overflowX: 'scroll' }}>
                <Table columns={columns} dataSource={data} onChange={onChange} />
            </div>
        </Card>
    );
};

export default Recognized;
