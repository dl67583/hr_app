import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const DynamicModal = ({ show, onHide, entity, entityData, onSubmit }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(entityData || {});
  }, [entityData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFormFields = () => {
    const keys = entityData ? Object.keys(entityData) : Object.keys(formData);
    return keys.map((key) => (
      <Form.Group controlId={key} key={key}>
        <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
        <Form.Control
          type={key === 'password' ? 'password' : (key === 'birthday' ? 'date' : 'text')}
          name={key}
          value={formData[key] || ''}
          onChange={handleChange}
          required
        />
      </Form.Group>
    ));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{entityData ? `Update ${entity}` : `Create ${entity}`}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>{renderFormFields()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DynamicModal;
