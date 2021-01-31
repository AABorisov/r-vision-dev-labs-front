import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import Filters from '../components/Filters/Filters';
import Recognized from '../components/Tables/Recognized/Recognized';
import Uploaded from '../components/Tables/Uploaded/Uploaded';
import recognizedMock from '../mocks/recognized';
import uploadedMock from '../mocks/uploaded';
import { IRecognizedTableRow, IUploadedTableRow } from '../interfaces';
import FileUploadPopup from '../components/Popups/FileUploadPopup/FileUploadPopup';

const { Title } = Typography;

const Home: React.FC = () => {
    const [filtered, setFiltered] = useState<IRecognizedTableRow[]>([]);
    const [uploaded, setUploaded] = useState<IUploadedTableRow[]>([]);

    useEffect(() => {
        setFiltered(recognizedMock);
        setUploaded(uploadedMock);
    }, []);

    const onFilter = (value: any, fieldName: string) => {
        const filtered = recognizedMock.filter((item: any) => item[fieldName] === value);

        setFiltered(filtered);
    };

    return (
        <>
            <FileUploadPopup />
            <Title>Dashboard</Title>
            <Filters onFilter={onFilter} />
            <Recognized data={filtered} />
            <Uploaded data={uploaded} />
        </>
    );
};

export default Home;
