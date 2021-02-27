import React from 'react';
import {Form, Button, Container, Row, Col, Jumbotron} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './style.css';


export default function Login(){
    return(
        
        <Container fluid="lg">
            <Jumbotron fluid className="text-center" style={{backgroundColor: "#343a40"}}>
                <Container style={{color: "#fff"}}>
                    <h1>Ddrive</h1>
                    <p>
                        Crie uma conta e salve seus arquivos de maneira segura.
                    </p>
                </Container>
            </Jumbotron>
            <Form>
                <Row className="justify-content-md-center">
                    <Col xs={6}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Seu email" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs={6}>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="Senha" />
                        </Form.Group>
                    </Col> 
                </Row>
                <Row className="justify-content-md-center"> 
                    <Col xs={3} className="text-center">
                        <Link to="/cadastro">Não possui conta? Clique aqui</Link>
                    </Col>                    
                    <Col xs={3}  className="text-center">
                        <Button variant="primary" type="submit" size="lg" block>
                            Entrar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}