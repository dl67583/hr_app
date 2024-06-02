// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ activeWorkers, totalWorkers, icon }) => {
    const data = {
        labels: ['Active Workers', 'Inactive Workers'],
        datasets: [
            {
                label: '# of Workers',
                data: [activeWorkers, totalWorkers - activeWorkers],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                borderWidth: 0, // Remove border

            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false, // Hide the default legend
            },
        },
        cutout: '90%', // Creates space for the icon in the center
    };

    return (
        <div style={{ position: 'relative', width: '200px', height: '200px', backgroundColor: "#fefefe", borderRadius: "50%" }}>
            <Pie data={data} options={options} />
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '24px',
                }}
            >
                <div className="flex-row justify-content-center align-items-center">
                <svg viewBox="0 0 384 512" width="50" title="child">
                    <path d="M120 72c0-39.765 32.235-72 72-72s72 32.235 72 72c0 39.764-32.235 72-72 72s-72-32.236-72-72zm254.627 1.373c-12.496-12.497-32.758-12.497-45.254 0L242.745 160H141.254L54.627 73.373c-12.496-12.497-32.758-12.497-45.254 0-12.497 12.497-12.497 32.758 0 45.255L104 213.254V480c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V368h16v112c0 17.673 14.327 32 32 32h16c17.673 0 32-14.327 32-32V213.254l94.627-94.627c12.497-12.497 12.497-32.757 0-45.254z" />
                </svg>
                <div className="text-center">
                <h6 style={{color:"black", textAlign:"middle", width:"100%"}}>{activeWorkers}</h6>

                </div>
                    
                </div>
            </div>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                transform: 'translate(50%, -50%)',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
            }}>

            </div>
        </div>
    );
};

export default PieChart;
