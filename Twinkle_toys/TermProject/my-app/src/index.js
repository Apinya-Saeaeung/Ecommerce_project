import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ตรวจสอบว่าใช้ App.js ถูกต้อง
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* ไม่ต้องมี <Router> ที่นี่ */}
  </React.StrictMode>
);
