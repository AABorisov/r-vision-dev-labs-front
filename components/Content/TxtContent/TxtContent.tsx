import React from 'react';
import {Row} from "antd";
import Card from '../../Cards/Card';
import dynamic from 'next/dynamic'

import txtdoc from '../../../mocks/txtdoc';

const TxtContent: React.FC = () => {
    const Minimap = dynamic(
        () => import('react-simple-minimap'),
        { ssr: false }
    )
    const renderPage = () => <div
            style={{
                whiteSpace: 'pre-line',
            }}
        >
            {txtdoc}
        </div>;
    return (
        <Card title={'Text'}>
            <Row>
                <Minimap of={renderPage()} />
                {renderPage()}
            </Row>
        </Card>
    );
};

export default TxtContent;
