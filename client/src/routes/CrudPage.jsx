import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import DynamicModal from '../components/DynamicModal';

const CrudPage = ({ entity }) => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentEntityData, setCurrentEntityData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/${entity}`);
      console.log(`Fetched ${entity}:`, response.data); // Debug log
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(`Error fetching ${entity}:`, error.response?.data || error.message);
      setData([]);  // Set an empty array on error
    }
  }, [entity]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShowModal = (entityData = null) => {
    setCurrentEntityData(entityData);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setCurrentEntityData(null);
    setModalShow(false);
  };

  const handleSubmit = async (entityData) => {
    try {
      if (currentEntityData) {
        await axios.put(`/api/${entity}/${currentEntityData.id}`, entityData);
        console.log(`Updated ${entity}:`, entityData); // Debug log
      } else {
        await axios.post(`/api/${entity}`, entityData);
        console.log(`Created ${entity}:`, entityData); // Debug log
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error(`Error saving ${entity}:`, error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await axios.delete(`/api/${entity}/${id}`);
      console.log(`Deleted ${entity} with id:`, id); // Debug log
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error(`Error deleting ${entity}:`, error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>{entity.charAt(0).toUpperCase() + entity.slice(1)}</h1>
      <Button onClick={() => handleShowModal()}>Create {entity}</Button>
      <ul>
        {data.map((item) => (
          <li key={item.id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
            {Object.keys(item).map((key) => (
              <div key={key} style={{ display: "inline-block", marginRight: "10px", border: "1px solid red" }}>
                {key === 'password' ? '********' : item[key]}
              </div>
            ))}
            <Button onClick={() => handleShowModal(item)}>Edit</Button>
            <Button onClick={() => handleDelete(item.id)}>Delete</Button>
          </li>
        ))}
      </ul>

      <DynamicModal
        show={modalShow}
        onHide={handleCloseModal}
        entity={entity}
        entityData={currentEntityData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CrudPage;
