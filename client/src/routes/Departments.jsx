import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/crud.css';


const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [createDepartment, setCreateDepartment] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    name: ""

  });
  const [editFormData, setEditFormData] = useState({
    name: ""

  });

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
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
    console.log(editFormData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/departments", createFormData);
      setCreateFormData({
        name: e.target.name.value
      });
      closeCreatePopup();
      fetchDepartments();
    } catch (error) {
      console.error("Error creating department:", error);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const handleUpdateDepartment = async (e) => {
    e.preventDefault()
    try {
      await axios.put(
        `http://localhost:3001/api/departments/${editDepartment.id}`,
        editFormData
      );
      closePopup();
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const openCreatePopup = (department) => {
    setCreateDepartment(department);
    setCreateFormData({ ...department });
  };

  const openPopup = (department) => {
    setEditDepartment(department);
    setEditFormData({ ...department });
  };

  const closePopup = () => {
    setEditDepartment(null);
  };
  
  const closeCreatePopup = () => {
    setCreateDepartment(null);
  };

  return (
    <div>
      <div className="container">
        <table className="table table-bordered users-tbl">
          <tbody>
            <tr className="table-dark">
              <th>Department</th>

              <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(departments)} className="btn btn-sm btn-success">Add Department</button></th>
            </tr>
            {departments.map((department) => (
              <>
                <tr key={department.id} className="table-light">
                  <td>{department.name}</td>
            
                  <td><button onClick={() => openPopup(department)} className="btn btn-sm btn-primary">Update</button></td>
                  <td><button onClick={() => deleteDepartment(department.id)} className="btn btn-sm btn-danger">Delete</button></td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      {createDepartment && (
        <div className="popup-bg">
          <div className="popup">
            <div className="popup-inner">
              <h2>Add department</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={createFormData.name}
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
      {editDepartment && (
        <div className="popup-bg">
          <div className="popup">
            <div className="popup-inner">
              <h2>Edit department</h2>
              <form onSubmit={handleUpdateDepartment}>

                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                />

               
                <button type="submit">Save</button>
                <button onClick={closePopup}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
