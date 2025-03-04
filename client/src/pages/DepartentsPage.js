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
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

// Fetch departments list from backend
const fetchDepartments = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.departments || [];
  } catch (error) {
    console.error(
      "Error fetching departments:",
      error.response?.data || error.message
    );
    showAlert("Error!",` ${error.response?.data?.message || error.message}`, "error");
    return [];
  }
};

const DepartmentsPage = () => {
  const { token, permissions } = useContext(AuthContext); // ✅ Ensure permissions is retrieved
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: "" });

  // ✅ Ensure departments are only fetched if "read" permission exists
  const { data: departmentsData = [], isLoading, error } = useQuery(
    ["departments"],
    () => fetchDepartments(token),
    { enabled: !!token && permissions?.includes("read") } // ✅ Prevent fetching if no permission
  );

  // ✅ Mutation for creating/updating a department (checks "create" permission)
  const mutation = useMutation(
    async (deptData) => {
      if (editDepartment) {
        return axios.put(`${API_BASE_URL}/api/departments/${deptData.id}`, deptData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const { id, ...createData } = deptData; // ✅ Remove ID from creation request
        return axios.post(`${API_BASE_URL}/api/departments`, createData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
        setOpen(false);
        setEditDepartment(null);
        setNewDepartment({ name: "" });
      },
      onError: (error) => {
        console.error("❌ Error creating or updating department:", error.response?.data || error.message);
        showAlert("Error!",` ${error.response?.data?.message || error.message}`, "error");

      },
    }
  );
  
  // ✅ Mutation for deleting a department (checks "delete" permission)
  const deleteDepartment = useMutation(
    async (deptId) => {
      return axios.delete(`${API_BASE_URL}/api/departments/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("departments"),
    }
  );

  const handleOpen = (dept = null) => {
    setEditDepartment(dept);
    setNewDepartment(dept ? { id: dept.id, name: dept.name } : { id: null, name: "" }); // ✅ Ensure ID is included when editing, null when creating
    console.log(dept)
    setOpen(true);
  };
  
  

  const handleChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    console.log("📡 Submitting Department Data:", newDepartment);
  
    if (editDepartment) {
      // ✅ Ensure ID is sent when updating
      mutation.mutate({ id: editDepartment.id, ...newDepartment });
    } else {
      // ✅ Ensure `id` is NOT sent for new departments (remove it)
      const { id, ...deptData } = newDepartment;
      mutation.mutate(deptData);
    }
  };
  

  // ✅ Prevent render errors if permissions are not loaded yet
  if (!permissions) return <p>Loading permissions...</p>;

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <h2>Departments</h2>

      {/* ✅ Button to open the modal for adding a new department (Only visible if "create" permission exists) */}
      {permissions.includes("create") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Department
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departmentsData.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.id}</TableCell>
              <TableCell>{dept.name}</TableCell>
              <TableCell>
                {/* ✅ Only show "Edit" button if "update" permission exists */}
                {permissions.includes("update") && (
                  <Button onClick={() => handleOpen(dept)} color="primary">
                    Edit
                  </Button>
                )}
                {/* ✅ Only show "Delete" button if "delete" permission exists */}
                {permissions.includes("delete") && (
                  <Button
                    onClick={() => deleteDepartment.mutate(dept.id)}
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

      {/* ✅ Modal for creating/editing a department (Only renders if user has "create" or "update" permission) */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editDepartment ? "Edit Department" : "Add Department"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Department Name"
            name="name"
            fullWidth
            value={newDepartment.name}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editDepartment ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
