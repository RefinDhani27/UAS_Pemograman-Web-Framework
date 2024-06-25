import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { Container, Row, Col, Card, Button, Alert, Image } from 'react-bootstrap';
import { signOut } from 'firebase/auth';

const Home = ({ handleLogout }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('Pengguna tidak terautentikasi.');
      return;
    }

    const uid = user.uid;
    const booksRef = ref(db, 'books');

    onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      if (booksData) {
        const booksList = Object.keys(booksData)
          .map((key) => ({
            id: key,
            ...booksData[key],
          }))
          .filter(book => book.uid === uid);
        setBooks(booksList);
      }
    });
  }, []);

  const handleAddBook = () => {
    navigate('/add-book');
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah kamu yakin untuk menghapus buku ini?')) {
      const bookRef = ref(db, `books/${id}`);
      remove(bookRef)
        .then(() => {
          setBooks(books.filter(book => book.id !== id));
        })
        .catch((error) => {
          setError('Gagal menghapus buku. ' + error.message);
        });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-book/${id}/${auth.currentUser.uid}`);
  };


  const handleLogoutClick = async () => {
    if (window.confirm('Apakah kamu yakin untuk keluar?')) {
      try {
        await signOut(auth);
        handleLogout();
        navigate('/');
      } catch (error) {
        setError('Gagal logout. ' + error.message);
      }
    }
  };

  return (
    <Container className="p-5">
      <Row>
        <Col>
          <Card className='p-5 shadow' style={{ border: 0, borderRadius: 20 }}>
            <Row className='mb-5'>
              <Col className='text-start'>
                <h1 className="fw-bold mb-5" style={{ marginTop: '-5px', textAlign: 'left' }}>Daftar Koleksi Buku</h1>
                {error && <Alert variant="danger">{error}</Alert>}
              </Col>
              <Col className="text-end">
                <Button variant="primary" className='fw-semibold' onClick={handleAddBook} style={{
                  paddingLeft: 40,
                  paddingRight: 40,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontSize: 18,
                  borderRadius: 15
                }}>Tambah Buku</Button>
                <Button variant="danger" className="fw-semibold ms-2" onClick={handleLogoutClick} style={{
                  paddingLeft: 40,
                  paddingRight: 40,
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontSize: 18,
                  borderRadius: 15
                }}>Keluar</Button>
              </Col>
            </Row>
            <Row>
              {books.map((book) => (
                <Col md={4} key={book.id}>
                  <Card className=' mb-4 shadow-sm' style={{ border: 0, borderRadius: 40, backgroundColor: '#1D4BC9' }}>
                    <Image variant='top' src={book.image} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, objectFit: 'cover' }} height={300} />
                    <Card.Body className='text-white p-4'>
                      <Card.Title className='fw-bold mb-4' style={{ fontSize: 22 }}>{book.title}</Card.Title>
                      <div style={{ textAlign: 'left' }}>
                        <Card.Text>
                          <strong className='me-2'>Pengarang : </strong> {book.author}
                        </Card.Text>
                        <Card.Text>
                          <strong className='me-2'>Tahun Terbit : </strong> {book.year}
                        </Card.Text>
                        <Card.Text>
                          <strong className='me-2'>Status : </strong>
                          <span className='fw-semibold' style={{
                            color: book.status === 'Sudah Dibaca' ? 'white' : 'white',
                            backgroundColor: book.status === 'Sudah Dibaca' ? '#06C13A' : '#FDAB0D',
                            padding: '10px 15px',
                            borderRadius: '8px',
                            display: 'inline-block'
                          }}>
                            {book.status}
                          </span>
                        </Card.Text>
                        <Card.Text>
                          <strong className='me-2'>Jumlah Halaman : </strong> {book.pages}
                        </Card.Text>
                        <Card.Text className='mb-4'>
                          <strong className='me-2'>Catatan : </strong>{book.description}
                        </Card.Text>
                      </div>
                      <Button className='fw-semibold text-white me-3' variant="warning" onClick={() => handleUpdate(book.id)} style={{
                        paddingLeft: 25,
                        paddingRight: 25,
                        paddingTop: 10,
                        paddingBottom: 10,
                        fontSize: 18,
                        borderRadius: 10
                      }}>Ubah</Button>
                      <Button className='fw-semibold' variant="danger" onClick={() => handleDelete(book.id)} style={{
                        paddingLeft: 25,
                        paddingRight: 25,
                        paddingTop: 10,
                        paddingBottom: 10,
                        fontSize: 18,
                        borderRadius: 10
                      }}>Hapus</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container >
  );
};

export default Home;
