import React, {useState} from "react";
import {Modal} from "antd";

interface IProps {
    isVisible: boolean;
    onCancel: () => void;
}

const FileUploadPopup = ({isVisible, onCancel}: IProps) => {
    const [file, setFile] = useState<string | Blob>("")


    const handleImagePreview = (e: any) => {
        setFile(e.target.files[0])
    }

    const handleSubmitFile = async () => {
        if (!file) {
            return
        }

        const myHeaders = new Headers();
        const formdata = new FormData();

        formdata.append("file_path", file, "6.png");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        };

        fetch("https://cybersecurity.devlabs-hack.ru/api/v1/document_upload/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    return (
        <Modal title="Upload file" visible={isVisible} footer={null} onCancel={onCancel}>
            <div>
                <input type="file" onChange={handleImagePreview}/>
                <label>Upload file</label>
                <input type="submit" onClick={handleSubmitFile} value="Submit"/>
            </div>
        </Modal>
    );
};

export default FileUploadPopup;
