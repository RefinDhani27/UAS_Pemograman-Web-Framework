import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Card, Form, Button, Container, Image, Alert } from 'react-bootstrap';
import '../css/Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
            navigate('/home'); // Redirect to home page after login
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Card className="p-4 shadow text-white" style={{ border: 0, borderRadius: 20, backgroundColor: '#1D4BC9', width: '500px' }}>
                <Card.Body>
                    <h3 className='fw-bold'>Welcome To</h3>
                    <h1 className="fw-bold" style={{ marginTop: '-5px' }}>LaciBuku</h1>
                    <Image src="gambar.png" alt="Logo" style={{width: 300, marginTop: '-60px', marginBottom: '-40px'}}/>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
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

                        <Form.Group controlId="formBasicPassword">
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
                            Masuk Sekarang
                        </Button>
                    </Form>
                    <p className="mt-3">
                        Masih Belum Punya Akun ? <Link to="/register" className='fw-bold' style={{color: '#FDAB0D', textDecoration: 'none'}}>Register</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
