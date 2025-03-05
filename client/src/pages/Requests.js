import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import showAlert from "../components/showAlert";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

const fetchRequests = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.requests || [];
  } catch (error) {
    console.error("Error fetching requests:", error.response?.data || error.message);
    showAlert("Error!",` ${error.response?.data?.message || error.message}`, "error");

    return [];
  }
};

const RequestsPage = () => {
    const { token, user, permissions } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const canCreateRequest = permissions.resources?.Requests?.actions?.includes("create");
const canUpdateRequest = permissions.resources?.Requests?.actions?.includes("update");
const canDeleteRequest = permissions.resources?.Requests?.actions?.includes("delete");

    const [open, setOpen] = useState(false);
    const [editRequest, setEditRequest] = useState(null);
    const [newRequest, setNewRequest] = useState({
      typeOfRequest: "leave",
      description: "",
    });
  
    const { data: requestsData = [], isLoading, error } = useQuery(
      ["requests"],
      () => fetchRequests(token),
      { enabled: !!token }
    );
  
    const mutation = useMutation(
      async (requestData) => {
        if (editRequest) {
          // Update existing request
          return axios.put(`${API_BASE_URL}/api/requests/${editRequest.id}`, requestData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Create new request
          return axios.post(`${API_BASE_URL}/api/requests`, requestData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("requests");
          setOpen(false);
          setEditRequest(null);
          setNewRequest({ typeOfRequest: "leave", description: "" });
        },
        onError: (error) => {
          console.error("❌ Error creating or updating request:", error.response?.data || error.message);
          showAlert("Error!",` ${error.response?.data?.message || error.message}`, "error");
        },
      }
    );
  
    const deleteRequest = useMutation(
      async (requestId) => {
        return axios.delete(`${API_BASE_URL}/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      },
      {
        onSuccess: () => queryClient.invalidateQueries("requests"),
      }
    );
  
    // Open the modal for creating or editing a request
    const handleOpen = (request = null) => {
      setEditRequest(request); // If editing, set the selected request
      setNewRequest(request ? { typeOfRequest: request.typeOfRequest, description: request.description } : { typeOfRequest: "leave", description: "" });
      setOpen(true);
    };
  
    const handleChange = (e) => {
      setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = () => {
      if (!user?.id) {
        console.error("User ID is missing. Cannot create request.");
        return;
      }
  
      const requestData = { ...newRequest, userId: user.id };
  
      if (editRequest) {
        requestData.id = editRequest.id;  // Ensure the ID is passed when editing
      }
  
      mutation.mutate(requestData);
    };
  
    if (isLoading) return <CircularProgress />;
    if (error) return <p>Error loading requests: {error.message}</p>;
  
    return (
      <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
        <h2>Requests</h2>
  
        {/* Button to open the modal for adding a new request */}
        {canCreateRequest && (
  <Button variant="contained" color="primary" onClick={() => handleOpen()}>
    Add Request
  </Button>
)}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestsData.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.typeOfRequest}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
        {canUpdateRequest && <Button onClick={() => handleOpen(request)} color="primary">Edit</Button>}
        {canDeleteRequest && <Button onClick={() => deleteRequest.mutate(request.id)} color="secondary">Delete</Button>}
      </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {/* Modal for creating/editing a request */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{editRequest ? "Edit Request" : "Add Request"}</DialogTitle>
          <DialogContent>
            <Select
              name="typeOfRequest"
              value={newRequest.typeOfRequest}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="leave">Leave</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
              <MenuItem value="travel">Travel</MenuItem>
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={newRequest.description}
              onChange={handleChange}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button color="primary" onClick={handleSubmit}>
              {editRequest ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  
  export default RequestsPage;
  
