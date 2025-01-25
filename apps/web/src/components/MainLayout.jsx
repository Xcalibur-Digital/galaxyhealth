import React, { useState } from 'react';
import { Container, Modal } from '@mantine/core';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthTest from './AuthTest';
import './MainLayout.css';

const MainLayout = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setLoginOpen(false);
    // Handle successful login
  };

  const handleRegisterSuccess = (user) => {
    setRegisterOpen(false);
    // Handle successful registration
  };

  return (
    <Container className="main-layout">
      <AuthTest />
      <header className="app-header">
        <h1>Patient Health Record</h1>
        <div className="health-icon">
          <div className="icon-pulse"></div>
        </div>
      </header>
      <div className="center-circle">
        <div className="glow-effect"></div>
        <div className="health-symbol">⚕</div>
      </div>
      <h2 className="ai-title">AI Health Agent</h2>
      <div className="cta-buttons">
        <button 
          className="create-account" 
          onClick={() => setRegisterOpen(true)}
        >
          Create Account
        </button>
        <button 
          className="sign-in"
          onClick={() => setLoginOpen(true)}
        >
          Sign In Account
        </button>
      </div>
      <div className="floating-icons">
        {/* Add your floating icons here */}
      </div>
      <Modal
        opened={loginOpen}
        onClose={() => setLoginOpen(false)}
        title="Sign In"
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>
      <Modal
        opened={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="Create Account"
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </Modal>
    </Container>
  );
};

export default MainLayout; 