import React, { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Button, Alert, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './AdminPanel.css';

const AdminPanel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [position, setPosition] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('employee');
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Nom est requis.";
        if (!email) newErrors.email = "E-mail est requis.";
        if (!password) newErrors.password = "Mot de passe est requis.";
        return newErrors;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setShowAlert(true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let imageUrl = '';
            if (file) {
                const storageRef = ref(storage, `profileImages/${user.uid}`);
                await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(storageRef);
            }

            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                name: name,
                imageUrl: imageUrl,
                phoneNumber: phoneNumber,
                location: location,
                position: position,
                role: role
            });
            console.log('User added successfully');
            // Reset form fields after successful user addition
            setEmail('');
            setPassword('');
            setName('');
            setFile(null);
            setPhoneNumber('');
            setLocation('');
            setPosition('');
            setRole('employee');
            setErrors({});
            setShowAlert(false);
        } catch (error) {
            console.error('Error adding user: ', error);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container className="admin-panel-container">
            <h2>Panneau d'administration</h2>
            {showAlert && (
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Erreur de validation!</Alert.Heading>
                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </Alert>
            )}
            <Form onSubmit={handleAddUser} className="admin-panel-form">
                <Row className='mb-4'>
                    <Col md={6}>
                        <Form.Group controlId="formName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Saisir le nom de l'utilisateur"
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Saisir l'email de l'utilisateur"
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col md={6}>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Mot de passe</Form.Label>
                            <div className="input-icon">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Saisir un mot de passe"
                                    isInvalid={!!errors.password}
                                />
                                <span onClick={toggleShowPassword} className="password-icon">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formFile">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col md={6}>
                        <Form.Group controlId="formPhoneNumber">
                            <Form.Label>Numéro de téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Saisir le numéro de téléphone de l'utilisateur"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formLocation">
                            <Form.Label>Emplacement</Form.Label>
                            <Form.Control
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Saisir l'emplacement de l'utilisateur"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col md={6}>
                        <Form.Group controlId="formPosition">
                            <Form.Label>Statut</Form.Label>
                            <Form.Control
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                placeholder="Saisir le statut de l'utilisateur"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formRole">
                            <Form.Label>Rôle</Form.Label>
                            <DropdownButton
                            variant='dark'
                                id="dropdown-basic-button"
                                title={role === 'admin' ? 'Administrateur' : 'Employé'}
                                onSelect={(e) => setRole(e)}
                            >
                                <Dropdown.Item eventKey="admin">Administrateur</Dropdown.Item>
                                <Dropdown.Item eventKey="employee">Employé</Dropdown.Item>
                            </DropdownButton>
                            <Form.Control
                                type="hidden"
                                value={role}
                                isInvalid={!role}
                            />
                            <Form.Control.Feedback type="invalid">
                                {role ? '' : 'Rôle est requis.'}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" variant='dark' className="add-user-button">Ajouter un utilisateur</Button>
            </Form>
        </Container>
    );
};

export default AdminPanel;
