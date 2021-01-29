import type { AppProps } from 'next/app';

import 'antd/dist/antd.css';

const Application = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default Application;
