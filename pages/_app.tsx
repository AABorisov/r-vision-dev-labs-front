import type { AppProps } from 'next/app';
import React from 'react';
import Wrapper from '../components/Wrapper';
import 'antd/dist/antd.css';

const Application = ({ Component, pageProps }: AppProps) => {
    return (
        <Wrapper>
            <Component {...pageProps} />
        </Wrapper>
    );
};

export default Application;
