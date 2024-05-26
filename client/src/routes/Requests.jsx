import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/crud.css';


const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [editrequests, setEditRequests] = useState(null);
    const [createRequests, setCreateRequests] = useState(null);
    const navigate = useNavigate()

    const [createFormData, setCreateFormData] = useState({
        typeOfRequest: "",
        description: "",
        userId: "",

    });
    const [editFormData, setEditFormData] = useState({
        typeOfRequest: "",
        description: "",
        userId: "",

    });

    useEffect(() => {
        fetchRequests();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/requests");
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
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
            await axios.post("http://localhost:3001/api/requests", createFormData);
            setCreateFormData({
                typeOfRequest: e.target.typeOfRequest.value,
                description: e.target.description.value,
                userId: e.target.userId.value,
            });
            console.log(createFormData);
            closeCreatePopup();
            fetchRequests();
            navigate('/requests');

        } catch (error) {
            console.error("Error creating request:", error);
        }
    };

    const deleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/requests/${id}`);
            fetchRequests();
            navigate('/requests');

        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };

    const handleUpdateRequest = async () => {
        try {
            await axios.put(
                `http://localhost:3001/api/requests/${editrequests.id}`,
                editFormData
            );
            closePopup();
            fetchRequests();
            navigate('/requests');
        } catch (error) {
            console.error("Error updating request:", error);
        }
    };

    const openCreatePopup = (request) => {
        setCreateRequests(request);
        setCreateFormData({ ...request });
    };

    const openPopup = (request) => {
        setEditRequests(request);
        setEditFormData({ ...request });
    };

    const closePopup = () => {
        setEditRequests(null);
    };
    const closeCreatePopup = () => {
        setCreateRequests(null)
    }

    return (
        <div>
            <h1></h1>


            <div className="container">
                <table className="table table-bordered users-tbl">
                    <tbody>
                        <tr className="table-dark">
                            <th>Type of Request</th>
                            <th>Description</th>
                            <th>UserId</th>

                            <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(requests)} className="btn btn-sm btn-success">Add Request</button></th>
                        </tr>
                        {requests.map((request) => (
                            <>
                                <tr key={request.id} className="table-light">
                                    <td>{request.typeOfRequest}</td>
                                    <td>{request.description}</td>
                                    <td>{request.userId}</td>

                                    <td><button onClick={() => openPopup(request)} className="btn btn-sm btn-primary">Update</button></td>
                                    <td><button onClick={() => deleteRequest(request.id)} className="btn btn-sm btn-danger">Delete</button></td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            {createRequests && (

                <div className="popup-bg">
                    <div className="popup">
                        <h2>Create Request</h2>
                        <div className="popup-inner d-flex justify-content-center align-items-center">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <input
                                        type="text"
                                        name="typeOfRequest"
                                        placeholder="typeOfRequest"
                                        value={createFormData.typeOfRequest}
                                        onChange={handleChange}

                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Description"
                                        value={createFormData.Description}
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className="row">
                                   
                                    <select
                                        name="userId"
                                        id="userId"
                                        onChange={handleChange}
                                        value={createFormData.userId}
                                    >
                                        <option value="">userId</option>
                                        {users.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} {item.surname}
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
            {editrequests && (
                <div className="popup-bg">
                    <div className="popup">
                        <h2>Edit Request</h2>
                        <div className="popup-inner d-flex justify-content-center align-items-center">
                            <form onSubmit={handleUpdateRequest}>
                                <div className="row">
                                    <input
                                        type="text"
                                        name="typeOfRequest"
                                        placeholder="typeOfRequest"
                                        value={editFormData.typeOfRequest}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="description"
                                        value={editFormData.description}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="row">
                                    <input
                                        type="text"
                                        name="userId"
                                        placeholder="userId"
                                        value={editFormData.userId}
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

export default Requests;