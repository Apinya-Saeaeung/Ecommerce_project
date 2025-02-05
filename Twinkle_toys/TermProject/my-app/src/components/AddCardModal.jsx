import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import './AddCardModal.css';

const AddCardModal = ({ show, handleClose, handleCardAdded }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCardAddedInModal, setIsCardAdded] = useState(false);
    const [error, setError] = useState('');

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleCardNumberChange = (e) => {
        const formattedValue = formatCardNumber(e.target.value);
        setCardNumber(formattedValue);
    };

    const formatExpiryDate = (value) => {
        return value.replace(/^(\d{2})(\d{0,2})$/, '$1/$2');
    };

    const handleExpiryDateChange = (e) => {
        const formattedValue = formatExpiryDate(e.target.value);
        setExpiryDate(formattedValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (cardNumber.replace(/\s/g, '').length !== 16) {
            setError('หมายเลขบัตรเครดิตต้องมี 16 หลัก');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            setError('กรุณากรอกวันหมดอายุในรูปแบบ MM/YY');
            return;
        }

        setIsLoading(true);
        setIsCardAdded(false);

        setTimeout(() => {
            const cardDetails = { cardNumber, expiryDate, cvv };
            handleCardAdded(cardDetails);
            setIsCardAdded(true);
            setIsLoading(false);
            handleClose();
        }, 2000);
    };

    return (
        <Modal show={show} onHide={handleClose} className="add-card-modal">
            <Modal.Header closeButton className="add-card-modal__header">
                <Modal.Title className="add-card-modal__title">เพิ่มบัตรเครดิต/บัตรเดบิตใหม่</Modal.Title>
            </Modal.Header>

            <Modal.Body className="add-card-modal__body">
                <Form onSubmit={handleSubmit} className="add-card-modal__form">

                    <Form.Group className="add-card-modal__form-group" controlId="formCardNumber">
                        <Form.Label className="add-card-modal__form-label">หมายเลขบัตร</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            required
                            maxLength={19}
                            className="add-card-modal__form-input"
                        />
                    </Form.Group>

                    <Form.Group className="add-card-modal__form-group" controlId="formCardExpiry">
                        <Form.Label className="add-card-modal__form-label">วันหมดอายุ (MM/YY)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            required
                            maxLength={5}
                            className="add-card-modal__form-input"
                        />
                    </Form.Group>

                    <Form.Group className="add-card-modal__form-group" controlId="formCardCVV">
                        <Form.Label className="add-card-modal__form-label">CVV</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                            maxLength={3}
                            className="add-card-modal__form-input"
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="add-card-modal__submit-button"
                    >
                        {isLoading ? 'กำลังเพิ่ม...' : 'เพิ่มบัตร'}
                    </Button>

                    {error && (
                        <Alert variant="danger" className="add-card-modal__alert">
                            {error}
                        </Alert>
                    )}
                    {isCardAddedInModal && !isLoading && (
                        <Alert variant="success" className="add-card-modal__alert">
                            บัตรของคุณถูกเพิ่มสำเร็จ!
                        </Alert>
                    )}
                </Form>

            </Modal.Body>
        </Modal>
    );
};

export default AddCardModal;
