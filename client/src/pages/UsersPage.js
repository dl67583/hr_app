import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
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

// ✅ Fetch users list from backend
const fetchUsers = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🔍 API Response (Users):", data); // ✅ Debugging
    return data.users || [];
  } catch (error) {
    console.error(
      "🔥 Error fetching users:",
      error.response?.data || error.message
    );
    return [];
  }
};

// ✅ Fetch departments list from backend
const fetchDepartments = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🔍 API Response (Departments):", data); // ✅ Debugging
    return Array.isArray(data.departments) ? data.departments : []; // ✅ Ensure it's always an array
  } catch (error) {
    console.error(
      "🔥 Error fetching departments:",
      error.response?.data || error.message
    );
    return [];
  }
};
const fetchRoles = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🔍 API Response (Roles):", data);
    return data.roles || [];
  } catch (error) {
    console.error(
      "🔥 Error fetching roles:",
      error.response?.data || error.message
    );
    return [];
  }
};

const UsersPage = () => {
  const { token, permissions = [], roles = [], user } = useContext(AuthContext);
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
  });

  const [allowedFields, setAllowedFields] = useState([]);
  const [allowedScopes, setAllowedScopes] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ Store department names
  const [roles_, setRoles_] = useState([]);

  // ✅ Fetch users list
  const {
    data: usersData = [],
    error,
    isLoading,
  } = useQuery(["users"], () => fetchUsers(token), { enabled: !!token });

  // ✅ Fetch departments list
  useEffect(() => {
    if (token) {
      fetchDepartments(token).then(setDepartments);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRoles(token).then(setRoles_);
    }
  }, [token]);
  // ✅ Fetch user permissions
  const [allowedActions, setAllowedActions] = useState([]); // ✅ Store allowed actions

  // ✅ Fetch permissions including actions
  useEffect(() => {
    if (token && user?.id) {
      axios
        .get(`${API_BASE_URL}/api/users/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          console.log(
            "🔍 Permissions API Response:",
            JSON.stringify(data, null, 2)
          );

          const userPermissions = data.Users || {}; // ✅ Ensure permissions exist
          setAllowedFields(userPermissions.fields || []);
          setAllowedScopes(userPermissions.scopes || []);
          setAllowedActions(userPermissions.actions || []);
        })
        .catch((error) =>
          console.error(
            "❌ Error fetching permissions:",
            error.response?.data || error.message
          )
        );
    }
  }, [token, user]);

  // ✅ Ensure `permissions` is always an array before checking `.includes()`
  const canCreateUser =
    Array.isArray(allowedActions) && allowedActions.includes("create");
  const canUpdateUser =
    Array.isArray(allowedActions) && allowedActions.includes("update");
  const canDeleteUser =
    Array.isArray(allowedActions) && allowedActions.includes("delete");

  // ✅ Mutation for creating/updating users
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

  // ✅ Mutation for deleting users
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

  // ✅ Open modal for creating/editing users
  const handleOpen = (user = null) => {
    setEditUser(user);
    setNewUser(
      user
        ? {
            name: user.name || "",
            surname: user.surname || "",
            username: user.username || "",
            email: user.email || "",
            password: "", // ✅ Always blank when editing
            birthday: user.birthday || "", // ✅ Ensure birthday is included
            hourlyPay: user.hourlyPay || "", // ✅ Ensure hourlyPay is included
            roleId: user.roleId?.toString() || "", // ✅ Ensure roleId is a string
            departmentId: user.departmentId || "",
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
          }
    );

    console.log("🔍 Editing User:", user ? user : "Creating new user");
    console.log("🔍 Selected Role ID:", user?.roleId);
    setOpen(true);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission (Create/Update)
  const handleSubmit = () => {
    const userData = { ...newUser };

    // ✅ Ensure password is only sent if valid
    if (
      !userData.password ||
      userData.password.trim() === "" ||
      userData.password === "none"
    ) {
      delete userData.password;
    }

    mutation.mutate(userData);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div>
      <h2>Users</h2>

      {/* ✅ Show Add User button only if user has create permissions */}
      {allowedActions.includes("create") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add User
        </Button>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            {permissions.includes("Users:update") ||
            permissions.includes("Users:delete") ? (
              <TableCell>Actions</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user) =>
            user?.id ? (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name || "No Name"}</TableCell>
                <TableCell>{user.surname || "No Surname"}</TableCell>
                <TableCell>{user.username || "No Username"}</TableCell>
                <TableCell>{user.email || "No Email"}</TableCell>
                <TableCell>
                  {departments.find((d) => d.id === user.departmentId)?.name ||
                    "No Department"}
                </TableCell>

                {/* ✅ Show Edit/Delete buttons only if user has permission */}
                {allowedActions.includes("update") ||
                allowedActions.includes("delete") ? (
                  <TableCell>
                    {allowedActions.includes("update") && (
                      <Button onClick={() => handleOpen(user)} color="primary">
                        Edit
                      </Button>
                    )}
                    {allowedActions.includes("delete") && (
                      <Button
                        onClick={() => deleteUser.mutate(user.id)}
                        color="secondary"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                ) : null}
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>

      {/* ✅ Modal for Adding/Editing Users */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          {allowedFields.includes("name") && (
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={newUser.name}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("surname") && (
            <TextField
              label="Surname"
              name="surname"
              fullWidth
              value={newUser.surname}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("username") && (
            <TextField
              label="Username"
              name="username"
              fullWidth
              value={newUser.username}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("email") && (
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={newUser.email}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("password") && (
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={handleChange}
              placeholder={
                editUser ? "Leave blank to keep current password" : ""
              }
            />
          )}
          {allowedFields.includes("birthday") && (
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newUser.birthday}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("hourlyPay") && (
            <TextField
              label="Hourly Pay"
              name="hourlyPay"
              fullWidth
              value={newUser.hourlyPay}
              onChange={handleChange}
            />
          )}
          {allowedFields.includes("roleId") && (
            <TextField
              select
              label="Role"
              name="roleId"
              fullWidth
              value={newUser.roleId}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Role</option>
              {roles_.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </TextField>
          )}
          {allowedFields.includes("departmentId") && (
            <TextField
              select
              label="Department"
              name="departmentId"
              fullWidth
              value={newUser.departmentId}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </TextField>
          )}
        </DialogContent>
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
