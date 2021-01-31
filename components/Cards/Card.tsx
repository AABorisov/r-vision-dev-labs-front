import React from 'react';
import { Layout, Card as AntdCard } from 'antd';
import classes from './Card.module.scss';

interface IProps {
    title: string;
    children: any;
}

const Card = ({ title, children }: IProps) => {
    return (
        <Layout className={classes.container}>
            <AntdCard title={title}>{children}</AntdCard>
        </Layout>
    );
};

export default Card;
