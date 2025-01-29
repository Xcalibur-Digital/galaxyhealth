import React from 'react';
import Banner from '../components/Banner';
import PatientList from '../components/PatientList';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <main className="main-content">
        <PatientList />
      </main>
    </div>
  );
};

export default Home; 