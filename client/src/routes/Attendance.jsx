import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/crud.css';


const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [users, setUsers] = useState([]);
    const [editAttendance, setEditAttendance] = useState(null);
    const [createAttendance, setCreateAttendance] = useState(null);
    const [createFormData, setCreateFormData] = useState({
        timeOfEntering: "",
        timeOfLeaving: "",
        userId: ""
    });
    const [editFormData, setEditFormData] = useState({
        timeOfEntering: "",
        timeOfLeaving: "",
        userId: ""
    });
    
    useEffect(() => {
        fetchAttendance();
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

    const fetchAttendance = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/timeAttendance");
            setAttendance(response.data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
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
        console.log(e.target.value);
        try {
            await axios.post("http://localhost:3001/api/timeAttendance", createFormData);
            setCreateFormData({
                timeOfEntering: e.target.timeOfEntering.value,
                timeOfLeaving: e.target.timeOfLeaving.value,
                userId: e.target.userId.value,
            });
            closeCreatePopup();
            fetchAttendance();
        } catch (error) {
            console.error("Error creating attendance:", error);
        }
    };

    const deleteAttendance = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/timeAttendance/${id}`);
            fetchAttendance();
        } catch (error) {
            console.error("Error deleting attendance:", error);
        }
    };
    const handleUpdateAttendance = async () => {
        try {
            await axios.put(
                `http://localhost:3001/api/timeAttendance/${editAttendance.id}`,
                editFormData
            );
            closePopup();
            fetchAttendance();
        } catch (error) {
            console.error("Error updating attendance:", error);
        }
    };

    const openCreatePopup = (attendance) => {
        setCreateAttendance(attendance);
        setCreateFormData({ ...attendance });
    };

    const openPopup = (attendance) => {
        setEditAttendance(attendance);
        setEditFormData({ ...attendance });
    };

    const closePopup = () => {
        setEditAttendance(null);
    };

    const closeCreatePopup = () => {
        setCreateAttendance(null);
    };

    return (
        <div>
            <div className="container">
                <table className="table table-bordered users-tbl">
                    <tbody>
                        <tr className="table-dark">
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Entered</th>
                            <th>Left</th>
                            <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(attendance)} className="btn btn-sm btn-success">Add Attendance</button></th>
                        </tr>
                        {attendance.map((att) => (
                            <>
                                <tr key={att.id} className="table-light">
                                    <td>{att.userId && users.find(user => user.id === att.userId)?.name}</td>
                                    <td>{att.userId && users.find(user => user.id === att.userId)?.surname}</td>
                                    <td>{att.timeOfEntering}</td>
                                    <td>{att.timeOfLeaving}</td>
                                    <td><button onClick={() => openPopup(att)} className="btn btn-sm btn-primary">Update</button></td>
                                    <td><button onClick={() => deleteAttendance(att.id)} className="btn btn-sm btn-danger">Delete</button></td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            {createAttendance && (
                <div className="popup-bg">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Add attendance</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <input
                                        type="time"
                                        name="timeOfEntering"
                                        placeholder="Time of Entry"
                                        value={createFormData.timeOfEntering}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="time"
                                        name="timeOfLeaving"
                                        placeholder="Time of Exit"
                                        value={createFormData.timeOfLeaving}
                                        onChange={handleChange}
                                    />

                                    <select
                                        name="userId"
                                        id="userId"
                                        onChange={handleChange}
                                        value={createFormData.userId}
                                    >
                                        <option value="">User</option>
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
            {editAttendance && (
                <div className="popup-bg">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Edit attendance</h2>
                            <form onSubmit={handleUpdateAttendance}>
                                <div className="row">
                                    <input
                                        type="time"
                                        name="timeOfEntering"
                                        placeholder="Time of Entry"
                                        value={editFormData.timeOfEntering}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="time"
                                        name="timeOfLeaving"
                                        placeholder="Time of Exit"
                                        value={editFormData.timeOfLeaving}
                                        onChange={handleEditChange}
                                    />

                                    <select
                                        name="userId"
                                        id="userId"
                                        onChange={handleEditChange}
                                        value={editFormData.userId}
                                    >
                                        <option value="">User</option>
                                        {users.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} {item.surname}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="row">
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

export default Attendance;
