import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
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
    return [];
  }
};

const DepartmentsPage = () => {
  const { token, user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: "" });

  // Query for departments
  const { data: departmentsData = [], isLoading, error } = useQuery(
    ["departments"],
    () => fetchDepartments(token),
    { enabled: !!token }
  );

  // Mutation for creating/updating a department
  const mutation = useMutation(
    async (deptData) => {
      if (editDepartment) {
        return axios.put(
          `${API_BASE_URL}/api/departments/${editDepartment.id}`,
          deptData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        return axios.post(`${API_BASE_URL}/api/departments`, deptData, {
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
        console.error(
          "❌ Error creating or updating department:",
          error.response?.data || error.message
        );
        alert(`Error: ${error.response?.data?.message || error.message}`);
      },
    }
  );

  // Mutation for deleting a department
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
    setNewDepartment(dept ? { name: dept.name } : { name: "" });
    setOpen(true);
  };

  const handleChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(newDepartment);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <h2>Departments</h2>

      {/* Button to open the modal for adding a new department */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
      >
        Add Department
      </Button>

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
                <Button onClick={() => handleOpen(dept)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => deleteDepartment.mutate(dept.id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for creating/editing a department */}
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
