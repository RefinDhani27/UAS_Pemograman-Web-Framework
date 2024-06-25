// src/components/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Container, Alert, Image } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccess('Pendaftaran Berhasil, Silahkan Login');
            setTimeout(() => {
                navigate('/');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className="p-4 shadow text-white" style={{ border: 0, borderRadius: 20, backgroundColor: '#1D4BC9', width: '500px' }}>
                <Card.Body>
                <h3 className='fw-bold'>Daftarkan Akun</h3>
                <h1 className="fw-bold" style={{ marginTop: '-5px' }}>LaciBukumu</h1>
                <Image src="gambar.png" alt="Logo" style={{width: 300, marginTop: '-60px', marginBottom: '-40px'}}/>
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Masukkan Email :</Form.Label>
                            <Form.Control
                                style={{borderRadius: 10, padding: 12}}
                                className="mb-4"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Masukkan Password :</Form.Label>
                            <Form.Control
                                style={{borderRadius: 10, padding: 12}}
                                className="mb-4"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button className='btn-custom fw-semibold' type="submit" style={{ paddingLeft: 60, paddingRight: 60, paddingTop: 15, paddingBottom: 15, borderRadius: 15, fontSize: 18}}>
                            Daftar Sekarang
                        </Button>
                    </Form>
                    <p className="mt-3 text-center">
                        Sudah Mempunyai Akun ? <Link to="/" className='fw-bold' style={{color: '#FDAB0D', textDecoration: 'none'}}>Login</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
