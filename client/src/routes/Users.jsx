import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom"
const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editUser, setEditUser] = useState(null); 
  const navigate = useNavigate()

  const [createFormData, setCreateFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
    position: "",
    role: "",

    departmentId: "",
 
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
    position: "",
    role: "",
    departmentId: "",

  });

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data);
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
      await axios.post("http://localhost:3001/api/users", createFormData);
      setCreateFormData({
        name: e.target.name.value,
        surname: e.target.surname.value,
        username: e.target.username.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value,
        birthday: new Date(e.target.birthday.value),
        position: e.target.position.value,
        role: e.target.role.value,
        departmentId: e.target.departmentId.value,
      });
      console.log(createFormData);
      fetchUsers();
      navigate('/users');

    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      fetchUsers();
      navigate('/users');

    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/${editUser.id}`,
        editFormData
      );
      closePopup(); 
      fetchUsers(); 
      navigate('/users');
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const openPopup = (user) => {
    setEditUser(user); 
    setEditFormData({ ...user }); 
  };

  const closePopup = () => {
    setEditUser(null); 
  };

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="surname"
          placeholder="surname"
          value={createFormData.surname}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="username"
          value={createFormData.username}
          onChange={handleChange}
        />
        <input
          type="phone"
          name="phone"
          placeholder="phone"
          value={createFormData.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={createFormData.password}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthday"
          placeholder="01/01/2001"
          value={createFormData.birthday}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="position"
          value={createFormData.position}
          onChange={handleChange}
        />
        <input
          type="role"
          name="role"
          placeholder="role"
          value={editFormData.role}
          onChange={handleChange}
        />
        <select
          name="departmentId"
          id="departmentId"
          onChange={handleChange}
          value={createFormData.departmentId}
        >
          <option value="">departmentId</option>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - 
           {user.departmentId && departments.find(department => department.id === user.departmentId)?.name}

            <button onClick={() => openPopup(user)}>Update</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {editUser && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
           
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
              <input
                type="text"
                name="surname"
                placeholder="surname"
                value={editFormData.surname}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="username"
                placeholder="username"
                value={editFormData.username}
                onChange={handleEditChange}
              />
              <input
                type="phone"
                name="phone"
                placeholder="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                value={editFormData.password}
                onChange={handleEditChange}
              />
              <input
                type="date"
                name="birthday"
                placeholder="01/01/2001"
                value={editFormData.birthday}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="position"
                placeholder="position"
                value={editFormData.position}
                onChange={handleEditChange}
              />
              <input
                type="role"
                name="role"
                placeholder="role"
                value={editFormData.role}
                onChange={handleEditChange}
              />
              <select
                name="departmentId"
                id="departmentId"
                onChange={handleEditChange}
                value={editFormData.departmentId}
              >
                <option value="">departmentId</option>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
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

export default Users;
