import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const GoogleAuth = ({ setUser, handleClose }) => {
  const [clientId, setClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ดึง clientId จาก backend
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get('http://localhost:8086/api/v1/auth/client-id', {
          headers: { 'API-Key': 'werj23489' },
        });
        if (response.data && response.data.client_id) {
          setClientId(response.data.client_id);
        } else {
          console.error('Client ID not found');
        }
      } catch (error) {
        console.error('Error fetching client ID:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientId();
  }, []);

  const verifyToken = async (response) => {
    try {
      const { credential } = response;
      const decodedToken = jwtDecode(credential); // ถอดรหัส Token ที่ได้จาก Google
      // ส่ง token ไปยัง backend เพื่อตรวจสอบ
      const verificationResponse = await axios.post(
        'http://localhost:8086/api/v1/auth/google/verify',
        { id_token: credential }
      );

      if (verificationResponse.status === 200) {
        const { data } = verificationResponse;
        const user = {
          name: data.user.name,
          email: data.user.email,
          picture: decodedToken.picture,
        };
        setUser(user); // อัพเดตข้อมูลผู้ใช้ใน state
        console.log('data:', data);
        sessionStorage.setItem('userID', data.user.id);
        sessionStorage.setItem('googleEmail', data.user.email);
        sessionStorage.setItem('accessToken', data.access_token);

        handleClose(); // ปิดหน้าต่างหลังจากล็อกอินสำเร็จ
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div> // แสดงข้อความโหลดข้อมูลระหว่างดึง clientId
      ) : (
        clientId && (
          <GoogleOAuthProvider clientId="504170200070-l2skku7pohrtbp71g9ht3q00bi14426k.apps.googleusercontent.com">
            <div className="text-center mt-3">
              <GoogleLogin
                onSuccess={verifyToken} // เมื่อ Google login สำเร็จ
                onError={handleGoogleFailure} // เมื่อเกิดข้อผิดพลาดจาก Google login
                useOneTap
              />
            </div>
          </GoogleOAuthProvider>
        )
      )}
    </div>
  );
};

export default GoogleAuth;
