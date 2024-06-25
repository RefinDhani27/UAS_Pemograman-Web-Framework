import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebaseConfig';
import { ref as dbRef, get, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, Form, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import '../css/UpdateBook.css';

const UpdateBook = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [pages, setPages] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const bookRef = dbRef(db, `books/${id}`);
                const snapshot = await get(bookRef);
                if (snapshot.exists()) {
                    const bookData = snapshot.val();
                    setTitle(bookData.title);
                    setAuthor(bookData.author);
                    setYear(bookData.year);
                    setDescription(bookData.description);
                    setStatus(bookData.status);
                    setPages(bookData.pages);
                    setCurrentImage(bookData.image);
                } else {
                    setError('Book not found.');
                }
            } catch (error) {
                setError('Failed to fetch book data. ' + error.message);
            }
        };

        fetchBookData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const bookRef = dbRef(db, `books/${id}`);
            let imageUrl = currentImage;

            const user = auth.currentUser;
            const uid = user ? user.uid : null;

            if (!uid) {
                setError('Pengguna tidak terautentikasi.');
                return;
            }

            if (image) {
                const imageRef = storageRef(storage, `books/${id}/${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await set(bookRef, {
                title,
                author,
                description,
                status,
                year,
                pages,
                image: imageUrl,
                uid
            });

            setSuccess('Book updated successfully!');
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (error) {
            setError('Failed to update book. ' + error.message);
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <Container className='p-5'>
            <Card className="p-5 shadow" style={{ border: 0, borderRadius: 20 }}>
                <Card.Body>
                    <h1 className="fw-bold mb-5" style={{ marginTop: '-5px', textAlign: 'left' }}>Ubah Koleksi Buku</h1>
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
                                        disabled
                                        style={{ borderRadius: 10 }}
                                        className="mb-4"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {currentImage && <Image src={currentImage} alt="Current Book" style={{ width: '300px', height: '450px', marginTop: '10px', borderRadius: 30, objectFit: 'cover'}} />}
                            </Col>
                        </Row>
                        <Button variant='primary' className='fw-semibold mb-2 me-3 mt-4' type="submit" style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10, borderRadius: 12, fontSize: 18, float: 'left' }}>
                            Ubah Buku
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

export default UpdateBook;
