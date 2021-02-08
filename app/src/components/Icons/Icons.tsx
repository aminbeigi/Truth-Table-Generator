import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

export const Icons: React.FC = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const githubLink = 'https://github.com/aminbeigi/truth-table-generator';

    return (
        // TODO: new line on body
        <>
            <div><button onAuxClick={() => window.open(githubLink)} onClick={() => window.location.href = githubLink}><i className="fab fa-github"></i></button></div>
            <div><button onClick={handleShow}><i className="far fa-question-circle"></i></button></div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This tool generates truth tables for propositional logic formulas.</p>
                    <p>For example, the formula p ∧ q  could be written as p || q, as p.</p>
                    <p>Enter an expression in the input box to get started.</p>
                    <p>Valid operators:</p>
                    <ul>
                        <li>
                            And: &amp;&amp;
                        </li>
                        <li>
                            Or: ||
                        </li>
                        <li>
                            Negation: !
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close 
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
