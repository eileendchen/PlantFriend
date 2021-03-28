import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../components/contexts/AuthContext";
import '../styles/Auth.scss';

const Signup = ({hide}) => {
  const [className, setClassName] = useState('')
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hide) {
      setClassName("hide");
    } else {
      setClassName("log");
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      window.location.reload()
    } catch {
      setError('Failed to create an account');
    }
    setLoading(false);
  }

  return (
    <>
    <div className={className}>
      <Card className='signup'>
        <Card.Body>
          <h1 className="test-center mb-4">Sign Up</h1>
          {currentUser && currentUser.email}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                ref={passwordConfirmationRef}
                required
              />
            </Form.Group>

            <Button disabled={loading} className="w-50" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
    </>
  );
};

export default Signup;
