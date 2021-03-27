import React, { useRef, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../components/contexts/AuthContext";


const Logout = (signup) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { logout, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  const loggingout = () => {
    logout()
    window.location.reload();
    return false;
  }

  return (
    <>
      <Card>
        <Card.Body>
        
          {currentUser && currentUser.email}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Button onClick={loggingout}>
            Log Out
          </Button>
            
        </Card.Body>
      </Card>
    </>
  );
};

export default Logout;
