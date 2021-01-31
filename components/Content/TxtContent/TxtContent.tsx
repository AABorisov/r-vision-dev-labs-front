import React from 'react';
import {Row} from "antd";
import Card from '../../Cards/Card';
import dynamic from 'next/dynamic'

import txtdoc from '../../../mocks/txtdoc';
import classes from './TxtContent.module.scss';

const TxtContent: React.FC = () => {
    const Minimap = dynamic(
        () => import('react-simple-minimap'),
        { ssr: false }
    )
    const renderPage = () => <div
            className={'textContent'}
            style={{
                whiteSpace: 'pre-line',
                lineHeight: '24px'
            }}
            dangerouslySetInnerHTML={{__html: txtdoc}}
        >
            {/*{txtdoc}*/}
        </div>;
    return (
        <Card title={'Text'}>
            <Row style={{
                position: 'relative',
                marginLeft: 50
            }}>
                <style global jsx>{`
                identity, malware, org, timestamp, software, tool, mitre_attack, ioc {
                   color: white;
                   padding: 3px 4px;
                   border-radius: 4px;
                }
                identity::after, malware::after, org::after,
                timestamp::after, software::after, tool::after,
                mitre_attack::after, ioc::after {
                   display: inline;
                   padding: 0px 4px;
                   margin: 3px 0px 3px 8px;
                   border: 1px solid white;
                   border-radius: 3px;
                }
                identity {
                   background: blue;
                }
                identity::after {
                   content: 'identity';
                }
                malware {
                   background: orange;
                }
                malware::after {
                   content: 'malware';
                }
                org {
                   background: silver;
                }
                org::after {
                   content: 'org';
                }
                timestamp {
                   background: brown;
                }
                timestamp::after {
                   content: 'timestamp';
                }
                software {
                   background: green;
                }
                software::after {
                   content: 'software';
                }
                tool {
                   background: purple;
                }
                tool::after {
                   content: 'tool';
                }
                mitre_attack {
                   background: red;
                }
                mitre_attack::after {
                   content: 'mitre_attack';
                }
                ioc {
                   background: gray;
                }
                ioc::after {
                   content: 'ioc';
                }
                
                .styles_minimapWindow__2BGG2 {
                   top: 150px;
                   right: unset;
                   left: 100px;
                }
                
                .textContent {
                  
                }
                
                `}</style>
                <Minimap of={renderPage()} width={100} height={'calc(100vh - 300px)'} className={classes.minimap}/>
                {renderPage()}
            </Row>
        </Card>
    );
};

export default TxtContent;
