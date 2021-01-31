import React from 'react';
import Wrapper from '../../components/Wrapper';

import { Row, Col } from 'antd';
import NlpTable from '../../components/Tables/NlpTable/NlpTable';
import { useRouter } from 'next/router';
import recognizedMock from '../../mocks/recognized';
import { INlpTableRow } from '../../interfaces';
import TxtContent from '../../components/Content/TxtContent/TxtContent';

const Document: React.FC = () => {
    const router = useRouter();
    const { documentId } = router.query;
    const nlpRow = recognizedMock.filter((item) => item.document_id === parseInt(documentId));

    const nlp_table = nlpRow.length ? Object.entries(nlpRow[0]) : [];

    const nlpTable: INlpTableRow[] = nlp_table.map((nlp, index) => {
        return {
            key: nlp[0],
            status: 0,
            nlp_id: index,
            attribute_name: nlp[0],
            attribute_value: nlp[1],
        };
    });

    return (
            <Row>
                <Col
                    style={{
                        width: '70%',
                        minWidth: '70%',
                        maxWidth: '70%',
                    }}
                >
                    <TxtContent />
                </Col>
                <Col
                    style={{
                        width: '30%',
                        minWidth: '30%',
                        maxWidth: '30%',
                    }}
                >
                    <NlpTable documentTitle={'Talos_-_The_art_and_science'} data={nlpTable} />
                </Col>
            </Row>
    );
};

export default Document;
