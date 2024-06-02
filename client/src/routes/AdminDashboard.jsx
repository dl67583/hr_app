import React from 'react';
import axios from 'axios';
import "../styles/AdminDashboard.css";
import PieChart from '../components/PieChart';
const AdminDashboard = () => {

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="row mt-5 mb-5 row-cols-3 justify-content-center align-items-center">
                    <div className="activeWorkers">
                        <PieChart activeWorkers={75} totalWorkers={100} />

                    </div>
                </div>


            </div>


        </div>
    )

}

export default AdminDashboard;