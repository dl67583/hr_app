import React from 'react';
import axios from 'axios';
import "../styles/dashboard.css";
import Card from '../components/Card';

const Dashboard = () => {

    return (
        <div className="container">

            <div className="row mt-4 mb-5 row-cols-3 justify-content-center align-items-center">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
            </div>
        
    )

}

export default Dashboard;