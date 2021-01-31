import React from 'react';
import Card from '../../Cards/Card';

import txtdoc from '../../../mocks/txtdoc';

const TxtContent: React.FC = () => {
    return (
        <Card title={'Text'}>
            <div>{txtdoc}</div>
        </Card>
    );
};

export default TxtContent;
