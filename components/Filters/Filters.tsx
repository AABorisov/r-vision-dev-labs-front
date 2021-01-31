import React from 'react';
import { Select, Typography, Col, Row } from 'antd';
import Card from '../Cards/Card';
import { campaigns, identities, industries, malwares, softwares, threatActors } from '../../mocks/filter';

const { Title } = Typography;

interface IProps {
    onFilter: (value: any, fieldName: string) => void;
}

const Filters = ({ onFilter }: IProps) => {
    const filters = [
        {
            title: 'Malware',
            options: malwares,
            onChange: (value: number) => onFilter(value, 'malware'),
        },
        {
            title: 'Software',
            options: softwares,
            onChange: (value: number) => onFilter(value, 'software'),
        },
        {
            title: 'Identity',
            options: identities,
            onChange: (value: number) => onFilter(value, 'identity'),
        },
        {
            title: 'Threat actor',
            options: threatActors,
            onChange: (value: number) => onFilter(value, 'threat_actor'),
        },
        {
            title: 'Campaign',
            options: campaigns,
            onChange: (value: number) => onFilter(value, 'campaign'),
        },
        {
            title: 'Industry',
            options: industries,
            onChange: (value: number) => onFilter(value, 'industry'),
        },
    ];

    return (
        <Card title="Filters">
            <Row gutter={[20, 20]}>
                {filters.map((filter, key) => (
                    <Col key={key}>
                        <Title level={4}>{filter.title}</Title>
                        <Select
                            style={{ width: 200 }}
                            placeholder="All"
                            options={filter.options}
                            onChange={filter.onChange}
                        />
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default Filters;
