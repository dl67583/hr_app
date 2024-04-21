import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/crud.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [editCandidates, setEditCandidates] = useState(null);
  const [createCandidates, setCreateCandidates] = useState(null)
  const navigate = useNavigate()

  const [createFormData, setCreateFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",

  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",

  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);
    try {
      await axios.post("http://localhost:3001/api/candidates", createFormData);
      setCreateFormData({
        name: e.target.name.value,
        surname: e.target.surname.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
      });
      console.log(createFormData);
      closeCreatePopup();
      fetchCandidates();
      navigate('/candidates');

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteCandidates = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/candidates/${id}`);
      fetchCandidates();
      navigate('/candidates');

    } catch (error) {
      console.error("Error deleting candidates:", error);
    }
  };

  const handleUpdateCandidates = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/candidates/${editCandidates.id}`,
        editFormData
      );
      closePopup();
      fetchCandidates();
      navigate('/candidates');
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const openCreatePopup = (candidates) => {
    setCreateCandidates(candidates);
    setCreateFormData({ ...candidates });
  };

  const openPopup = (candidates) => {
    setEditCandidates(candidates);
    setEditFormData({ ...candidates });
  };

  const closePopup = () => {
    setEditCandidates(null);
  };
  const closeCreatePopup = () => {
    setCreateCandidates(null)
  }

  return (
    <div>
      <h1></h1>


      <div className="container">
        <table className="table table-bordered users-tbl">
          <tbody>
            <tr className="table-dark">
              <th>Name</th>
              <th>Surame</th>
              <th>Email</th>
              <th>Phone</th>
              <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(candidates)} className="btn btn-sm btn-success">Add User</button></th>
            </tr>
            {candidates.map((candidates) => (
              <>
                <tr key={candidates.id} className="table-light">
                  <td>{candidates.name}</td>
                  <td>{candidates.surname}</td>
                  <td>{candidates.email}</td>
                  <td>{candidates.phone}</td>
                  <td><button onClick={() => openPopup(candidates)} className="btn btn-sm btn-primary">Update</button></td>
                  <td><button onClick={() => deleteCandidates(candidates.id)} className="btn btn-sm btn-danger">Delete</button></td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      {createCandidates && (

        <div className="popup-bg">
          <div className="popup">
            <h2>Create Candidates</h2>
            <div className="popup-inner d-flex justify-content-center align-items-center">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={createFormData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={createFormData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <input
                    type="text"
                    name="surname"
                    placeholder="surname"
                    value={createFormData.surname}
                    onChange={handleChange}
                  />
                  <input
                    type="phone"
                    name="phone"
                    placeholder="phone"
                    value={createFormData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <button type="submit" className="btn btn-primary col-4">Save</button>
                  <button onClick={closeCreatePopup} className="btn btn-danger col-4">Cancel</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
      {editCandidates && (
        <div className="popup-bg">
          <div className="popup">
            <h2>Edit Candidates</h2>
            <div className="popup-inner d-flex justify-content-center align-items-center">
              <form onSubmit={handleUpdateCandidates}>
                <div className="row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="row">
                  <input
                    type="text"
                    name="surname"
                    placeholder="surname"
                    value={editFormData.surname}
                    onChange={handleEditChange}
                  />
                  <input
                    type="phone"
                    name="phone"
                    placeholder="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="row justify-content-between">
                  <button type="submit" className="btn btn-primary col-4">Save</button>
                  <button onClick={closePopup} className="btn btn-danger col-4">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
