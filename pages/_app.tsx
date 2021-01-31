import type { AppProps } from 'next/app';
import React from 'react';
import 'antd/dist/antd.css';

const Application = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
        </>
    );
};

export default Application;
