import React, { useState, useEffect } from "react";
import axios from "axios";


const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    headOfDepartmentId:""
 
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    headOfDepartmentId:""

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
    console.log(e.target);
    try {
      await axios.post("http://localhost:3001/api/departments", createFormData);
      setCreateFormData({
        name: e.target.name.value,
    

      });
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
  const handleUpdateDepartment = async () => {
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

  const openPopup = (department) => {
    setEditDepartment(department); 
    setEditFormData({ ...department }); 
  };

  const closePopup = () => {
    setEditDepartment(null); 
  };
  return (
    <div>
      <h1>Departments</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={createFormData.name}
          onChange={handleChange}
        />
         <select name="headOfDepartmentId" id="headOfDepartmentId" 
                 onChange={handleChange}
                 value={createFormData.headOfDepartmentId}>
          <option value="" disabled selected>Head of Department</option>
          {users.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {item.surname}
              {


              }
            </option>
            
          ))}
        </select>


        <button type="submit">Add Department</button>
      </form>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>
            {department.name} - {department.headOfDepartmentId && users.find(user => user.id === department.headOfDepartmentId)?.name}
            <button onClick={() => deleteDepartment(department.id)}>Delete</button>
            <button onClick={() => openPopup(department)}>Update</button>

          </li>
        ))}
      </ul>
      {editDepartment && (
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
              
              <select
                name="headOfDepartmentId"
                id="headOfDepartmentId"
                onChange={handleEditChange}
                value={editFormData.headOfDepartmentId}
              >
                <option value="">headOfDepartment</option>
                {users.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.surname}
         
                  </option>
                ))}
              </select>
    
              <button type="submit">Save</button>
              <button onClick={closePopup}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
