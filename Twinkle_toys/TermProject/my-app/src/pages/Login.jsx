import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
import * as Components from '../components/LoginSignupStyled.js';
import { Modal, Button } from 'react-bootstrap';
import GoogleAuth from '../components/GoogleAuth';
import './styles.css';

function Login() {
    const [email] = useState('');
    const [password] = useState('');
    const [setError] = useState('');
    const [setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [signIn, toggle] = useState(true);
    const navigate = useNavigate();

    const [confirmPassword] = useState('');

    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password || !confirmPassword) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8086/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    // const Forgotpass = () => {
    //   navigate("/forgot");
    // };

    const handleShow = () => setShowLogin(true);
    const handleClose = () => setShowLogin(false);

    //Log
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        if (!email || !password) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8086/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                navigate(-1);  // ย้อนกลับไปหน้าก่อนหน้า
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="div-body">
            <Components.Container>

                {/* Sign Up Section */}
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form onSubmit={handleSubmitSignUp}>
                        <Components.Subtitle>Twinkle Toys Shop </Components.Subtitle>
                        <p></p>

                        <img src="/images/twinkletoy_shop.jpg" alt="Twinkle Toys shop" style={{ width: '300px', marginRight: '8px' }} />

                        <div style={{ textAlign: 'left' }}>
                            <p> </p>
                            <p><strong>สาขาทั้งหมดของเราในประเทศไทย</strong> </p>
                            <p>No.123, Happiness Road 101/1</p>
                            <p>Grand Central Nakhon Pathom, 6th Floor</p>
                            <p>Grand Central Bangkok, 3rd Floor</p>
                            <p>Grand Central Phuket, 3rd Floor</p>
                            <p>Grand Central Pattaya, 2nd Floor</p>
                            <p>Grand Central Chiang Mai, 4th Floor</p>
                            <p>Grand Central Khon Kaen, 3rd Floor</p>
                        </div>
                    </Components.Form>
                </Components.SignUpContainer>

                {/* Sign In Section */}
                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form onSubmit={handleSubmitLogin}>

                        <Components.Logo src="/images/twinkletoys.jpg" alt="Logo" />
                        <Components.Subtitle>เข้าสู่ระบบ</Components.Subtitle>
                        <p> </p>
                        <p><strong>ขอต้อนรับสู่ Twinkle Toys</strong> </p>
                        <p>แหล่งรวมของเล่นเสริมพัฒนาการที่ได้รับการออกแบบมาอย่างพิถีพิถัน เพื่อเป็นส่วนหนึ่งของการเจริญเติบโตและการเรียนรู้ที่มีคุณภาพของเด็กๆ</p>
                        <p> </p>
                        <div className="form-container">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="light"
                                    onClick={handleShow}
                                    style={{ padding: '10px 67px', fontSize: '18px', borderRadius: '0' }} // กำหนดขอบตรง
                                >
                                    <img src="/images/google.jpg" alt="Twinkle Toys Logo" style={{ width: '20px', marginRight: '5px' }} />
                                    <span>เข้าสู่ระบบด้วย Google</span>
                                </Button>
                            </div>
                        </div>



                        {/* Modal for Google login */}
                        <Modal show={showLogin} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>เข้าสู่ระบบ</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <GoogleAuth
                                    setUser={(user) => {
                                        setUser(user);
                                        sessionStorage.setItem('user', JSON.stringify(user));
                                    }}
                                    
                                    handleClose={handleClose}
                                />
                            </Modal.Body>
                        </Modal>



                        {/* Display user info after login */}
                    </Components.Form>
                </Components.SignInContainer>

                {/* Modal for Google login */}
                <Modal show={showLogin} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>เข้าสู่ระบบ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <GoogleAuth
                            setUser={(user) => {
                                setUser(user);
                                sessionStorage.setItem('user', JSON.stringify(user));
                                navigate("/");
                            }}
                            handleClose={handleClose}
                        />
                    </Modal.Body>
                </Modal>

                {/* Display user info after login */}
                {user && <p> {user.name}</p>}

                {/* Overlay for Switching Sign In / Sign Up */}
                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>
                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Subtitle>ยินดีต้อนรับ</Components.Subtitle>
                            <Components.Paragraph>
                                สวัสดี, ยินดีต้อนรับ คุณสามารถสั่งซื้อสินค้าออนไลน์ได้ที่เซ็บไซต์อย่างเป็นทางการของเรา เข้าสู่รับบเลย
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)}>
                                เข้าสู่ระบบ
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title>Twinkle Toys</Components.Title>
                            <Components.Subtitle>เกี่ยวกับเรา</Components.Subtitle>
                            <Components.Paragraph>
                                เยี่ยมชม Twinkle Toys ได้ทั้งในช่องทางออนไลน์และทางหน้าร้านเพื่อเลือกของเล่นที่ดีที่สุดในการเสริมพัฒนาการ
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(false)}>
                                ดูสาขา
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>
                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
        </div>

    );
}

export default Login;
