import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const Dashboard = () => {
  // const { user, logout } = useAuth();

  return (
    <div>
      {/* <h1>Welcome, {user.username}</h1> */}
      {/* <button onClick={logout}>Logout</button> */}
      <div className='row'>
        <div className='col'>
          <Card />
        </div>
        <div className='col'>
          <Card />
        </div>
        <div className='col'>
          <Card />
        </div>
        <div className='col'>
          <Card />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
