import {Layout, Card as AntdCard} from 'antd';

import classes from './Card.module.scss';

const Card: React.FC<{title: string}> = ({ title, children }) => {
  return (
    <Layout className={classes.container}>
      <AntdCard title={title}>
        { children }
      </AntdCard>
    </Layout>
  );
}

export default Card;
