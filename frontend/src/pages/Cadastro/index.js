import React from 'react';
import {Form, Button, Container, Row, Col, Jumbotron} from 'react-bootstrap';
//import {Link} from 'react-router-dom';


export default function Cadastro(){
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
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Nome de Usuário</Form.Label>
                            <Form.Control type="text" placeholder="Usuário" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs={6}>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Informe seu Email" />
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
                <Row className="text-center">
                    <Col>
                        <Button variant="success" type="submit" size="lg">
                            Criar conta
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}