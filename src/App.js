import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRouter from './AppRouter';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleRegister = (username, password) => {
    console.log('User Terdaftar :', { username, password });
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error Logout ", error);
    }
  };

  return (
    <div className="App">
      <AppRouter
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
      />
    </div>
  );
}

export default App;
