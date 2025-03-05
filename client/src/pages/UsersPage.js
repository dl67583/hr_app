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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Checkbox,
  ListItemText,
  TablePagination,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

const fetchUsers = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.users || [];
  } catch (error) {
    console.error(
      "🔥 Error fetching users:",
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

const fetchDepartments = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data.departments) ? data.departments : [];
  } catch (error) {
    console.error(
      "🔥 Error fetching departments:",
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

const fetchRoles = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.roles || [];
  } catch (error) {
    console.error(
      "🔥 Error fetching roles:",
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

const UsersPage = () => {
  const { token, permissions } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    birthday: "",
    hourlyPay: "",
    roleId: "",
    departmentId: "",
    daysOff: 0,
    sickDaysTaken: 0,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const {
    data: usersData = [],
    error,
    isLoading,
  } = useQuery(["users"], () => fetchUsers(token), { enabled: !!token });

  const { data: departments = [] } = useQuery(
    ["departments"],
    () => fetchDepartments(token),
    { enabled: !!token }
  );

  const { data: roles_ = [] } = useQuery(["roles"], () => fetchRoles(token), {
    enabled: !!token,
  });

  const canCreateUser =
    permissions.resources?.Users?.actions?.includes("create");
  const canUpdateUser =
    permissions.resources?.Users?.actions?.includes("update");
  const canDeleteUser =
    permissions.resources?.Users?.actions?.includes("delete");

  const mutation = useMutation(
    async (userData) => {
      if (editUser) {
        return axios.put(`${API_BASE_URL}/api/users/${editUser.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        return axios.post(`${API_BASE_URL}/api/users`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
        setOpen(false);
        setEditUser(null);
      },
    }
  );

  const deleteUser = useMutation(
    async (userId) => {
      return axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("users"),
    }
  );

  const handleOpen = (user = null) => {
    setEditUser(user);
    setNewUser(
      user
        ? {
            name: user.name || "",
            surname: user.surname || "",
            username: user.username || "",
            email: user.email || "",
            password: "",
            birthday: user.birthday || "",
            hourlyPay: user.hourlyPay || "",
            roleId: user.roleId?.toString() || "",
            departmentId: user.departmentId || "",
            daysOff: user.daysOffTaken || 0,
            sickDaysTaken: user.sickDaysTaken || 0,
          }
        : {
            name: "",
            surname: "",
            username: "",
            email: "",
            password: "",
            birthday: "",
            hourlyPay: "",
            roleId: "",
            departmentId: "",
            daysOff: 0,
            sickDaysTaken: 0,
          }
    );

    setOpen(true);
  };

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const userData = { ...newUser };

    if (
      !userData.password ||
      userData.password.trim() === "" ||
      userData.password === "none"
    ) {
      delete userData.password;
    }

    mutation.mutate(userData);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  if (error)
    return <p className="text-red-500">Error loading users: {error.message}</p>;

  if (isLoading) return <CircularProgress />;

  const displayedUsers = usersData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        {canCreateUser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Add User
          </Button>
        )}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Days Off</TableCell>
            <TableCell>Sick Days Taken</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.surname}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {departments.find((d) => d.id === user.departmentId)?.name ||
                  "No Department"}
              </TableCell>
              <TableCell>{user.daysOffTaken}</TableCell>{" "}
              <TableCell>{user.sickDaysTaken}</TableCell>{" "}
              <TableCell>
                {canUpdateUser && (
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                )}
                {canDeleteUser && (
                  <Button onClick={() => deleteUser.mutate(user.id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={usersData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="mt-4"
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
        <div className="">
          <DialogContent>
            <TextField
              label="First Name"
              name="name"
              fullWidth
              value={newUser.name}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Surname"
              name="surname"
              fullWidth
              value={newUser.surname}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={newUser.username}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={newUser.email}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              fullWidth
              value={newUser.birthday}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Hourly Pay"
              name="hourlyPay"
              type="number"
              fullWidth
              value={newUser.hourlyPay}
              onChange={handleChange}
              style={{ marginBottom: 10 }}
            />
            <FormControl fullWidth style={{ marginBottom: 10 }}>
              <InputLabel>Department</InputLabel>
              <Select
                name="departmentId"
                value={newUser.departmentId}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="roleId"
                value={newUser.roleId}
                onChange={handleChange}
              >
                {roles_.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Days Off"
              name="daysOff"
              type="number"
              fullWidth
              value={newUser.daysOffTaken}
              onChange={handleChange}
              style={{ marginBottom: 10, marginTop: 10 }}
            />
          </DialogContent>
        </div>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersPage;
