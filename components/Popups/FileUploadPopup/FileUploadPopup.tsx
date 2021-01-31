import React, { useContext, useState } from 'react';
import { Modal } from 'antd';
import { PopupUploadContext } from '../../../contexts/PopupUploadContext';

const FileUploadPopup = () => {
    const { isShow, toggle } = useContext(PopupUploadContext);
    const [file, setFile] = useState<string | Blob>('');

    const handleImagePreview = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmitFile = async () => {
        if (!file) {
            return;
        }

        const myHeaders = new Headers();
        const formdata = new FormData();

        formdata.append('file_path', file, '6.png');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        fetch('https://cybersecurity.devlabs-hack.ru/api/v1/document_upload/', requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    };

    return (
        <Modal title="Upload file" visible={isShow} footer={null} onCancel={() => toggle!()}>
            <div>
                <input type="file" onChange={handleImagePreview} />
                <input type="submit" onClick={handleSubmitFile} value="Submit" />
            </div>
        </Modal>
    );
};

export default FileUploadPopup;
