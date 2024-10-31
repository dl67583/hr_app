import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/crud.css';
import Swal from 'sweetalert2'


const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([])
  const [editUser, setEditUser] = useState(null);
  const [createUsers, setCreateUsers] = useState(null)
  const [projects, setProjects] = useState([])
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
        text: "Error creating user: " + error.response.data.error,
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
        text: "Error deleting user: " + error.response.data.error,
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
        text: "Error updating user: " + error.response.data.error,
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
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Surname</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Hourly Pay</th>
              <th className="p-3 text-right">
                <button onClick={() => openCreatePopup(users)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add User</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-gray-50 border-b text-black">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.surname}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone}</td>
                <td className="p-3">{user.departmentId && departments.find(department => department.id === user.departmentId)?.name}</td>
                <td className="p-3">{user.hourlyPay}</td>
                <td className="p-3 flex justify-end space-x-2">
                  <button onClick={() => openPopup(user)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Update</button>
                  <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {createUsers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <input type="text" name="name" placeholder="Name" value={createFormData.name} onChange={handleChange} className="border p-2 rounded w-full" />
                <input type="text" name="surname" placeholder="Surname" value={createFormData.surname} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="text" name="username" placeholder="Username" value={createFormData.username} onChange={handleChange} className="border p-2 rounded w-full" />
                <input type="email" name="email" placeholder="Email" value={createFormData.email} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="password" name="password" placeholder="Password" value={createFormData.password} onChange={handleChange} className="border p-2 rounded w-full" />
                <input type="tel" name="phone" placeholder="Phone" value={createFormData.phone} onChange={handleChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="date" name="birthday" value={createFormData.birthday} onChange={handleChange} className="border p-2 rounded w-full" />
                <select name="departmentId" onChange={handleChange} value={createFormData.departmentId} className="border p-2 rounded w-full">
                  <option value="">Select Department</option>
                  {departments.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <input type="number" step="0.01" name="hourlyPay" placeholder="Hourly Pay" value={createFormData.hourlyPay} onChange={handleChange} className="border p-2 rounded w-full" />
                <select name="roleId" onChange={handleChange} value={createFormData.roleId} className="border p-2 rounded w-full">
                  <option value="">Select Role</option>
                  {roles.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                <button onClick={closeCreatePopup} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="flex space-x-4">
                <input type="text" name="name" placeholder="Name" value={editFormData.name} onChange={handleEditChange} className="border p-2 rounded w-full" />
                <input type="text" name="surname" placeholder="Surname" value={editFormData.surname} onChange={handleEditChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="text" name="username" placeholder="Username" value={editFormData.username} onChange={handleEditChange} className="border p-2 rounded w-full" />
                <input type="email" name="email" placeholder="Email" value={editFormData.email} onChange={handleEditChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="password" name="password" placeholder="Password" value={editFormData.password} onChange={handleEditChange} className="border p-2 rounded w-full" />
                <input type="tel" name="phone" placeholder="Phone" value={editFormData.phone} onChange={handleEditChange} className="border p-2 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <input type="date" name="birthday" value={editFormData.birthday} onChange={handleEditChange} className="border p-2 rounded w-full" />
                <select name="departmentId" onChange={handleEditChange} value={editFormData.departmentId} className="border p-2 rounded w-full">
                  <option value="">Select Department</option>
                  {departments.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                <button onClick={closePopup} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;