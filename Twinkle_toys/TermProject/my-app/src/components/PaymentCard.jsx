import React, { useState } from 'react';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddCardModal from './AddCardModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './PaymentCard.css';  // เชื่อมต่อกับไฟล์ CSS สำหรับการตกแต่ง

const PaymentCard = ({ totalPrice, order }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCardAdded, setIsCardAdded] = useState(false);  // สำหรับเก็บสถานะการเพิ่มบัตร
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handlePaymentSelect = (method) => {
        setPaymentMethod(method);
        setConfirmationMessage(`คุณเลือกวิธีการชำระเงิน: ${method === 'cash' ? 'เก็บปลายทาง' : method === 'qr' ? 'QR Code' : 'บัตรเครดิต/บัตรเดบิต'}`);
    };

    const handlePaymentConfirm = () => {
        if (!paymentMethod) {
            alert('กรุณาเลือกวิธีการชำระเงินก่อน');
            return;
        }

        if (paymentMethod === 'card' && !isCardAdded) {
            alert('กรุณาเพิ่มบัตรเครดิต/บัตรเดบิตก่อนที่จะชำระเงิน');
            return;
        }

        setIsLoading(true);
        const redirectPath = paymentMethod === 'qr' ? '/qrcode' : '/order-success';
        console.log("Order payment:", order);  // ตรวจสอบค่าของ order ที่เข้ามา

        // ใช้ setTimeout เพื่อจำลองการโหลดข้อมูล
        setTimeout(() => {
            console.log("Order ก่อน navigate:", order);
            navigate(redirectPath, { state: { totalPrice: totalPrice, order: order } });
        }, 3000);
    };

    const handleCardAdded = (cardDetails) => {
        console.log('บัตรที่เพิ่ม:', cardDetails);
        setIsCardAdded(true);  // เปลี่ยนสถานะให้เป็น true หลังเพิ่มบัตรสำเร็จ
    };

    return (
        <div className="payment-card-container">
            {isLoading && (
                <div className="loading-overlay">
                    <Spinner animation="border" />
                    <div className="loading-text">กำลังดาวน์โหลด...</div>
                </div>
            )}

            <Card className="payment-card">
                <Card.Body>
                    <div className="payment-card-header">
                        <Card.Title>เลือกวิธีการชำระเงิน</Card.Title>
                        <div className="payment-method-buttons">
                            <Button
                                variant={paymentMethod === 'cash' ? 'primary' : 'outline-primary'}
                                onClick={() => handlePaymentSelect('cash')}
                                className="payment-button"
                            >
                                เก็บปลายทาง
                            </Button>
                            <Button
                                variant={paymentMethod === 'qr' ? 'primary' : 'outline-primary'}
                                onClick={() => handlePaymentSelect('qr')}
                                className="payment-button"
                            >
                                QR Code
                            </Button>
                            <Button
                                variant={paymentMethod === 'card' ? 'primary' : 'outline-primary'}
                                onClick={() => handlePaymentSelect('card')}
                                className="payment-button"
                            >
                                บัตรเครดิต/บัตรเดบิต
                            </Button>
                        </div>
                    </div>

                    {confirmationMessage && (
                        <Alert variant="success" className="confirmation-message">
                            {confirmationMessage}
                        </Alert>
                    )}

                    {paymentMethod === 'card' && (
                        <Button
                            variant="outline-primary"
                            onClick={() => setShowModal(true)}
                            className={`add-card-button ${isCardAdded ? 'added' : ''}`}
                        >
                            <FontAwesomeIcon icon={isCardAdded ? faCheckCircle : faCreditCard} className="icon" />
                            {isCardAdded ? 'บัตรของคุณถูกเพิ่มแล้ว' : 'เพิ่มบัตรเครดิต/บัตรเดบิตใหม่'}
                        </Button>
                    )}

                    <div className="total-amount">
                        <strong>ยอดชำระทั้งหมด:</strong> ฿{totalPrice.toFixed(2)}
                    </div>

                    <div className="confirm-payment">
                        <Button
                            variant="success"
                            onClick={handlePaymentConfirm}
                            className="confirm-button"
                        >
                            ยืนยันการชำระเงิน
                        </Button>
                    </div>
                </Card.Body>

                <AddCardModal show={showModal} handleClose={() => setShowModal(false)} handleCardAdded={handleCardAdded} />
            </Card>
        </div>
    );
};

export default PaymentCard;
