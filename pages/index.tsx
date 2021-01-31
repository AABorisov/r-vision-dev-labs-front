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
        const requestOptions = {
            method: 'GET',
        };

        fetch('https://cybersecurity.devlabs-hack.ru/api/v1/documents/', requestOptions)
            .then((response) => response.json())
            // .then((response) => console.log(response))
            .then((result) => {
                return result.map((row: {id: number, original_name: string, document_type?: string, created_at: string}) => {
                    return {
                        key: row.id,
                        id: row.id,
                        document: row.original_name,
                        category: row.document_type || 'Article',
                        creationDate: row.created_at,
                    };
                });
            })
            .then((result) => {
                setUploaded(result);
            })
            .catch((error) => {
                console.log('error', error)
                return [];
            })
            .finally(() => {
                // setUploaded(result);
            })
        ;
        setFiltered(recognizedMock);
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
