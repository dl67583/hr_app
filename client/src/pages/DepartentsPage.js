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
  const { token, permissions } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: "" });

  // Query for departments
  const {
    data: departmentsData = [],
    isLoading,
    error,
  } = useQuery(["departments"], () => fetchDepartments(token), {
    enabled: !!token,
  });
  const canReadDepartments = permissions?.actions?.includes("read") || false;
  const canCreateDepartment = permissions.resources?.Departments?.actions?.includes("create");
  const canUpdateDepartment = permissions.resources?.Departments?.actions?.includes("update");
  const canDeleteDepartment = permissions.resources?.Departments?.actions?.includes("delete");
  
  // console.log("🔍 Permissions for Departments:", permissions);

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
    <div>
      <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
        <h2>Departments</h2>
        {canCreateDepartment && (
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
              
                {(canUpdateDepartment|| canDeleteDepartment )&&
                <TableCell>Actions</TableCell>
                
                
                }
              
              
            </TableRow>
          </TableHead>
          <TableBody>
            {departmentsData.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.id}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>
                {canUpdateDepartment && <Button onClick={() => handleOpen(dept)}>Edit</Button>}
                {canDeleteDepartment && <Button onClick={() => deleteDepartment.mutate(dept.id)}>Delete</Button>}
              </TableCell>
                  
                
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
    </div>
  );
};

export default DepartmentsPage;
