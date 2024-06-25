import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebaseConfig'; // Tambahkan auth di sini
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, Form, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import '../css/AddBook.css';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [pages, setPages] = useState('');
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const bookRef = dbRef(db, 'books');
            const newBookKey = push(bookRef).key;
            const newBookRef = dbRef(db, `books/${newBookKey}`);

            const user = auth.currentUser;
            const uid = user ? user.uid : null;

            if (!uid) {
                setError('Pengguna tidak terautentikasi.');
                return;
            }

            let imageUrl = null;
            if (image) {
                const imageRef = storageRef(storage, `books/${newBookKey}/${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await set(newBookRef, {
                title,
                author,
                description,
                status,
                year,
                pages,
                image: imageUrl,
                uid
            });

            setSuccess('Buku berhasil ditambahkan!');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (error) {
            setError('Gagal menambahkan buku. ' + error.message);
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <Container className='p-5'>
            <Card className="p-5 shadow" style={{ border: 0, borderRadius: 20 }}>
                <Card.Body>
                    <h1 className="fw-bold mb-5" style={{ marginTop: '-5px', textAlign: 'left' }}>Tambah Koleksi Buku</h1>
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Row>
                            <Col md={3}>
                                <Form.Group controlId="formTitle">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Judul Buku</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAuthor" className="mt-3">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Pengarang</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDescription" className="mt-3">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Catatan</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        as="textarea"
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="formStatus">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Status</Form.Label>
                                    <Form.Select
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="Sudah Dibaca">Sudah Dibaca</option>
                                        <option value="Belum Dibaca">Belum Dibaca</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="formYear" className="mt-3">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Tahun Terbit</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        type="date"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPages" className="mt-3">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Jumlah Halaman</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10, padding: 12 }}
                                        className="mb-4"
                                        type="number"
                                        min="1"
                                        value={pages}
                                        onChange={(e) => setPages(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formImage" className="mt-3">
                                    <Form.Label className="mb-3 fw-semibold" style={{ float: 'left' }}>Upload Gambar Buku</Form.Label>
                                    <Form.Control
                                        style={{ borderRadius: 10 }}
                                        className="mb-4"
                                        type="file"
                                        onChange={handleImageChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Image src="gambar_2.png" alt="Logo" style={{ width: 500, marginTop: '-30px' }} />
                            </Col>
                        </Row>
                        <Button variant='primary' className='fw-semibold mb-2 me-3 mt-4' type="submit" style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10, borderRadius: 12, fontSize: 18, float: 'left' }}>
                            Tambah Buku
                        </Button>
                        <Button variant='success' className='fw-semibold mb-2 text-white mt-4' onClick={() => navigate('/home')} style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10, borderRadius: 12, fontSize: 18, float: 'left' }}>
                            Kembali ke Beranda
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddBook;
