import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/crud.css';


const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [editMeetings, setEditMeetings] = useState(null);
    const [createMeetings, setCreateMeetings] = useState(null);
    const [createFormData, setCreateFormData] = useState({
        date_and_time: "",
        userId: ""
    });
    const [editFormData, setEditFormData] = useState({
        date_and_time: "",
        userId: ""
    });
    
    useEffect(() => {
        fetchMeetings();
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

    const fetchMeetings = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/timeMeetings");
            setMeetings(response.data);
        } catch (error) {
            console.error("Error fetching meetings:", error);
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
            await axios.post("http://localhost:3001/api/timeMeetings", createFormData);
            setCreateFormData({
                date_and_time: e.target.date_and_time.value,
                userId: e.target.userId.value,
            });
            closeCreatePopup();
            fetchMeetings();
        } catch (error) {
            console.error("Error creating meetings:", error);
        }
    };

    const deleteMeetings = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/timeMeetings/${id}`);
            fetchMeetings();
        } catch (error) {
            console.error("Error deleting meetings:", error);
        }
    };
    const handleUpdateMeetings = async () => {
        try {
            await axios.put(
                `http://localhost:3001/api/timeMeetings/${editMeetings.id}`,
                editFormData
            );
            closePopup();
            fetchMeetings();
        } catch (error) {
            console.error("Error updating meetings:", error);
        }
    };

    const openCreatePopup = (meetings) => {
        setCreateMeetings(meetings);
        setCreateFormData({ ...meetings });
    };

    const openPopup = (meetings) => {
        setEditMeetings(meetings);
        setEditFormData({ ...meetings });
    };

    const closePopup = () => {
        setEditMeetings(null);
    };

    const closeCreatePopup = () => {
        setCreateMeetings(null);
    };

    return (
        <div>
            <div className="container">
                <table className="table table-bordered users-tbl">
                    <tbody>
                        <tr className="table-dark">
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Date & Time</th>
                            <th colSpan={2} className="justify-content-end text-end"><button onClick={() => openCreatePopup(meetings)} className="btn btn-sm btn-success">Add Meetings</button></th>
                        </tr>
                        {meetings.map((meet) => (
                            <>
                                <tr key={meet.id} className="table-light">
                                    <td>{meet.userId && users.find(user => user.id === meet.userId)?.name}</td>
                                    <td>{meet.userId && users.find(user => user.id === meet.userId)?.surname}</td>
                                    <td>{meet.date_and_time}</td>
                                    <td><button onClick={() => openPopup(meet)} className="btn btn-sm btn-primary">Update</button></td>
                                    <td><button onClick={() => deleteMeetings(meet.id)} className="btn btn-sm btn-danger">Delete</button></td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            {createMeetings && (
                <div className="popup-bg">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Add meetings</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <input
                                        type="time"
                                        name="date_and_time"
                                        placeholder="Time of Entry"
                                        value={createFormData.date_and_time}
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
            {editMeetings && (
                <div className="popup-bg">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Edit meetings</h2>
                            <form onSubmit={handleUpdateMeetings}>
                                <div className="row">
                                    <input
                                        type="time"
                                        name="date_and_time"
                                        placeholder="Date & Time"
                                        value={editFormData.date_and_time}
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

export default Meetings;