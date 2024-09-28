import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/crud.css';
import Swal from 'sweetalert2'
import { useAuth } from "../context/AuthContext";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([])
  const [editUser, setEditUser] = useState(null);
  const [createUsers, setCreateUsers] = useState(null)
  const [projects, setProjects] = useState([])
  const user = useAuth();
  const navigate = useNavigate()

  const [createFormData, setCreateFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
    hourlyPay: "",
    departmentId: "",
    roleId: "",
    token: ""
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
    hourlyPay: "",
    departmentId: "",
    roleId: "",
  });


  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/roles");
      setRoles(response.data);

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/departments");
      setDepartments(response.data);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/projects");
      setProjects(response.data);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles()
    fetchProjects()
  }, []);

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
    try {
      setCreateFormData({
        name: e.target.name.value,
        surname: e.target.surname.value,
        username: e.target.username.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value,
        birthday: e.target.birthday.value,
        departmentId: e.target.departmentId.value,
        roleId: e.target.roleId.value,
        hourlyPay: e.target.hourlyPay.value,
        token: null,
      });
     
      await axios.post(`http://localhost:3001/api/users`, createFormData);
    
      closeCreatePopup();
      fetchUsers();
      navigate('/users');

    } catch (error) {

      Swal.fire({
        title: 'Error!',
        text:"Error creating user: " + error.response.data.error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      fetchUsers();
      navigate('/users');

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: "Error deleting user: " +error.response.data.error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
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
      Swal.fire({
        title: 'Error!',
        text: "Error updating user: " +error.response.data.error,
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };

  const openCreatePopup = (user) => {
    setCreateUsers(user);
    setCreateFormData({ ...user });
  };

  const openPopup = (user) => {
    setEditUser(user);
    setEditFormData({ ...user });
  };

  const closePopup = () => {
    setEditUser(null);
  };
  const closeCreatePopup = () => {
    setCreateUsers(null)
  }

  return (
    <div>
      <p>Welcome, {user.username}</p>

      <div className="container">
        <table className="table table-bordered users-tbl">
          <tbody>
            <tr className="table-dark">
              <th>Name</th>
              <th>Surame</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Hourly Pay</th>
              {/* <th>Position</th>
              <th>Role</th> */}
              {/* <th>Position</th>
              <th>Role</th> */}
              <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(users)} className="btn btn-sm btn-success">Add User</button></th>
            </tr>
            {users.map((user) => (
              <>
                <tr key={user.id} className="table-light">
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.departmentId && departments.find(department => department.id === user.departmentId)?.name}</td>
                  <td>{user.hourlyPay}</td>
                  {/* <td>{user.position}</td>
          
                  {/* <td>{user.position}</td>
                  <td>{user.role}</td> */}
                  <td><button onClick={() => openPopup(user)} className="btn btn-sm btn-primary">Update</button></td>
                  <td><button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger">Delete</button></td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      {createUsers && (

        <div className="popup-bg">
          <div className="popup">
            <h2>Create User</h2>
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
                    type="text"
                    name="surname"
                    placeholder="surname"
                    value={createFormData.surname}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                </div>
                <div className="row">
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={createFormData.username}
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
                </div>
                <div className="row">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={createFormData.password}
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
                  <input
                    type="date"
                    name="birthday"
                    placeholder="01/01/2001"
                    value={createFormData.birthday}
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
                </div>
                <div className="row">
                  <input
                    type="number"
                    step="0.01"
                    name="hourlyPay"
                    placeholder="hourly pay"
                    value={createFormData.hourlyPay}
                    onChange={handleChange}
                  />
                  <select
                    name="roleId"
                    id="roleId"
                    onChange={handleChange}
                    value={createFormData.roleId}
                  >
                    <option value="">role Id</option>
                    {roles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
      {editUser && (
        <div className="popup-bg">
          <div className="popup">
            <h2>Edit User</h2>
            <div className="popup-inner d-flex justify-content-center align-items-center">
              <form onSubmit={handleUpdateUser}>
                <div className="row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="surname"
                    placeholder="surname"
                    value={editFormData.surname}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="row">
                </div>
                <div className="row">
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={editFormData.username}
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
                </div>
                <div className="row">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={editFormData.password}
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
                <div className="row">
                  <input
                    type="date"
                    name="birthday"
                    placeholder="01/01/2001"
                    value={editFormData.birthday}
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
                </div>
                <div className="row">

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

export default Users;
