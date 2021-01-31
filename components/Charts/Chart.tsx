import React, {useEffect, useState} from "react";
import {Line} from 'react-chartjs-2';


const Document = () => {
    const [chartData, setChartData] = useState({});

    const chart = () => {
        setChartData({
            labels: ['cve', 'cwe', 'org'],
            datasets: [
                {
                    label: 'Data',
                    data: [12, 33, 22],
                    backgroundColor: ['rgba(75, 192, 192, 0.6)'],
                    borderWidth: 4
                }
            ]
        })
    }

    useEffect(() => {
            chart()
        }, []);
    return(
        <div className="App">
            <h1>Document</h1>
            <div style={{width: "700px", margin: "25px", background: "white"}}>
                <Line data={chartData} options={{
                    responsive: true,

                }} />
            </div>
        </div>
    );
};

export default Document;
