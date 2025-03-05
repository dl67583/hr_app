import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
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

// Fetch leaves from backend
const fetchLeaves = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/leaves`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.leaves || [];
  } catch (error) {
    console.error(
      "Error fetching leaves:",
      error.response?.data || error.message
    );
    showAlert(
      "Error!",
      ` ${error.response?.data?.message || error.message}`,
      "error"
    );
    return [];
  }
};

// Fetch users for assigning leave
const fetchUsers = async (token) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.users || [];
};

const LeavesPage = () => {
  const { token, user, permissions } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editLeave, setEditLeave] = useState(null);
  const [leaveData, setLeaveData] = useState({
    type: "paid",
    description: "",
    userId: "",
    status: "pending",
  });
  const [users, setUsers] = useState([]);
  const canCreateLeave =
    permissions.resources?.Leaves?.actions?.includes("create");
  const canUpdateLeave =
    permissions.resources?.Leaves?.actions?.includes("update");
  const canDeleteLeave =
    permissions.resources?.Leaves?.actions?.includes("delete");

  // Fetch users
  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsers);
    }
  }, [token]);

  // Fetch Leaves
  const {
    data: leavesData = [],
    isLoading,
    error,
  } = useQuery(["leaves"], () => fetchLeaves(token), { enabled: !!token });

  const mutation = useMutation(
    async (leaveRequest) => {
      if (editLeave) {
        // Update existing leave request
        return axios.put(
          `${API_BASE_URL}/api/leaves/${editLeave.id}`,
          leaveRequest,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Create new leave request
        return axios.post(`${API_BASE_URL}/api/leaves`, leaveRequest, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("leaves");
        setOpen(false);
        setEditLeave(null);
        setLeaveData({
          type: "paid",
          description: "",
          userId: "",
          status: "pending",
        });
      },
      onError: (error) => {
        console.error(
          "❌ Error creating or updating leave:",
          error.response?.data || error.message
        );
        showAlert(
          "Error!",
          ` ${error.response?.data?.message || error.message}`,
          "error"
        );
      },
    }
  );

  const deleteLeave = useMutation(
    async (leaveId) => {
      return axios.delete(`${API_BASE_URL}/api/leaves/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("leaves"),
    }
  );

  // Open the modal for creating or editing a leave request
  const handleOpen = (leave = null) => {
    setEditLeave(leave);
    setLeaveData(
      leave
        ? {
            type: leave.type,
            description: leave.description,
            userId: leave.userId,
            status: leave.status,
          }
        : { type: "paid", description: "", userId: "", status: "pending" }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!user?.id) {
      console.error("User ID is missing. Cannot create leave request.");
      return;
    }

    const leaveRequest = { ...leaveData, userId: user.id };

    if (editLeave) {
      leaveRequest.id = editLeave.id; // Ensure ID is passed when editing
    }

    mutation.mutate(leaveRequest);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading leaves: {error.message}</p>;

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <h2>Leave Requests</h2>

      {canCreateLeave && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Leave Request
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leavesData.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.id}</TableCell>
              <TableCell>{leave.type}</TableCell>
              <TableCell>{leave.description}</TableCell>
              <TableCell>
                {users.find((user) => user.id === leave.userId)?.name ||
                  "Unknown"}
              </TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>
                {canUpdateLeave && (
                  <Button onClick={() => handleOpen(leave)} color="primary">
                    Edit
                  </Button>
                )}
                {canDeleteLeave && (
                  <Button
                    onClick={() => deleteLeave.mutate(leave.id)}
                    color="secondary"
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for creating/editing a leave request */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editLeave ? "Edit Leave Request" : "Add Leave Request"}
        </DialogTitle>
        <DialogContent>
          <Select
            name="type"
            value={leaveData.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="maternity">Maternity</MenuItem>
            <MenuItem value="paternity">Paternity</MenuItem>
            <MenuItem value="medical">Medical</MenuItem>
          </Select>
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={leaveData.description}
            onChange={handleChange}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editLeave ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeavesPage;
