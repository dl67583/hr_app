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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Checkbox,
  ListItemText,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

// Fetch roles list from backend (ensure your backend includes the Permissions association)
const fetchRoles = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.roles || [];
  } catch (error) {
    console.error("Error fetching roles:", error.response?.data || error.message);
    return [];
  }
};

// Fetch available permissions for initial selection
const fetchPermissions = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/rolePermissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.permissions || [];
  } catch (error) {
    console.error("Error fetching permissions:", error.response?.data || error.message);
    return [];
  }
};

const RolesPage = () => {
  const { token, permissions: userPermissions = [] } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // For role creation/edit modal
  const [editRole, setEditRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [] // initial permissions can be selected via multi-select
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);

  // State for editing a role’s permissions separately
  const [roleForPermissionsEdit, setRoleForPermissionsEdit] = useState(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  // Query for roles
  const { data: rolesData = [], isLoading, error } = useQuery(
    ["roles"],
    () => fetchRoles(token),
    { enabled: !!token }
  );

  // Query for available permissions (for the creation modal)
  useEffect(() => {
    if (token) {
      fetchPermissions(token).then(setAvailablePermissions);
    }
  }, [token]);

  // Mutation for creating/updating a role (excluding detailed permission editing)
  const roleMutation = useMutation(
    async (roleData) => {
      if (editRole) {
        await axios.put(`${API_BASE_URL}/api/roles/${editRole.id}`, { name: roleData.name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Optionally update the role’s permissions here
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/roles`, { name: roleData.name }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const createdRole = response.data.role;
        // For each selected permission (initial assignment), assign it to the new role.
        for (const permId of roleData.permissions) {
          const permission = availablePermissions.find((p) => p.id === permId);
          if (permission) {
            await axios.post(`${API_BASE_URL}/api/rolePermissions`, {
              roleId: createdRole.id,
              action: permission.action,
              resource: permission.resource,
              fields: permission.fields,
              scope: permission.scope,
            }, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles");
        setOpen(false);
        setEditRole(null);
        setNewRole({ name: "", permissions: [] });
      },
    }
  );

  // Mutation for deleting a role
  const deleteRole = useMutation(
    async (roleId) => {
      return axios.delete(`${API_BASE_URL}/api/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("roles"),
    }
  );

  const handleOpen = (role = null) => {
    setEditRole(role);
    setNewRole(
      role
        ? { name: role.name, permissions: role.Permissions ? role.Permissions.map(p => p.id) : [] }
        : { name: "", permissions: [] }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };

  const handlePermissionsChange = (e) => {
    setNewRole({ ...newRole, permissions: e.target.value });
  };

  const handleSubmit = () => {
    roleMutation.mutate(newRole);
  };

  // Open the Edit Permissions dialog for a role
  const handleEditPermissions = (role) => {
    setRoleForPermissionsEdit(role);
    setPermissionsDialogOpen(true);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading roles: {error.message}</p>;

  return (
    <div>
      <h2>Roles</h2>
      {userPermissions.includes("Roles:create") && (
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Role
        </Button>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Permissions</TableCell>
            {(userPermissions.includes("Roles:update") || userPermissions.includes("Roles:delete")) && (
              <TableCell>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rolesData.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => handleEditPermissions(role)}
                >
                  Edit Permissions
                </Button>
              </TableCell>
              {(userPermissions.includes("Roles:update") || userPermissions.includes("Roles:delete")) && (
                <TableCell>
                  {userPermissions.includes("Roles:update") && (
                    <Button onClick={() => handleOpen(role)} color="primary">
                      Edit
                    </Button>
                  )}
                  {userPermissions.includes("Roles:delete") && (
                    <Button onClick={() => deleteRole.mutate(role.id)} color="secondary">
                      Delete
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Creating/Editing a Role */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editRole ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            name="name"
            fullWidth
            value={newRole.name}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="permissions-label">Initial Permissions</InputLabel>
            <Select
              labelId="permissions-label"
              multiple
              name="permissions"
              value={newRole.permissions}
              onChange={handlePermissionsChange}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const perm = availablePermissions.find((p) => p.id === id);
                    return perm ? `${perm.action} ${perm.resource}` : "";
                  })
                  .join(", ")
              }
            >
              {availablePermissions.map((perm) => (
                <MenuItem key={perm.id} value={perm.id}>
                  {`${perm.action} ${perm.resource}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editRole ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Permissions Dialog */}
      {permissionsDialogOpen && roleForPermissionsEdit && (
        <EditPermissionsDialog
          role={roleForPermissionsEdit}
          token={token}
          onClose={() => {
            setPermissionsDialogOpen(false);
            queryClient.invalidateQueries("roles");
          }}
        />
      )}
    </div>
  );
};

// Component for editing a role's permissions
function EditPermissionsDialog({ role, token, onClose }) {
  // Mapping of resource to available fields
  const resourceFields = {
    Users: ["*", "id", "name", "surname", "username", "email", "birthday", "hourlyPay", "departmentId"],
    Roles: ["*", "id", "name", "createdAt", "updatedAt"],
    Departments: ["*", "id", "name", "createdAt", "updatedAt"],
    Requests: ["*", "id", "typeOfRequest", "description", "status"],
    TimeAttendance: ["*", "id", "userId", "checkIn", "checkOut"],
    Leaves: ["*", "id", "type", "description", "userId", "departmentId"],
    "*": ["*"],
  };

  const [editedPermissions, setEditedPermissions] = useState([]);
  const [removedPermissionIds, setRemovedPermissionIds] = useState([]);

  useEffect(() => {
    if (role && role.Permissions) {
      // Parse fields from comma-separated string to an array.
      setEditedPermissions(
        role.Permissions.map((perm) => ({
          id: perm.id,
          action: perm.action,
          resource: perm.resource,
          fields: perm.fields
            ? perm.fields === "*"
              ? ["*"]
              : perm.fields.split(",").map(f => f.trim())
            : [],
          scope: perm.scope,
        }))
      );
    } else {
      setEditedPermissions([]);
    }
  }, [role]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...editedPermissions];
    updated[index][field] = value;
    setEditedPermissions(updated);
  };

  const handleRemoveRow = (index) => {
    const perm = editedPermissions[index];
    if (perm.id) {
      setRemovedPermissionIds((prev) => [...prev, perm.id]);
    }
    const updated = [...editedPermissions];
    updated.splice(index, 1);
    setEditedPermissions(updated);
  };

  const handleAddRow = () => {
    setEditedPermissions((prev) => [
      ...prev,
      { action: "read", resource: "Roles", fields: [], scope: "own" },
    ]);
  };

  // New function to handle fields selection.
  const handleFieldsSelect = (index, event, resource) => {
    let selected = event.target.value;
    const options = resourceFields[resource] || resourceFields["*"];
    // If "all" (i.e. "*") is selected and not all options are selected, select all.
    if (selected.includes("*") && selected.length < options.length) {
      selected = options;
    }
    handleFieldChange(index, "fields", selected);
  };

  const handleSave = async () => {
    try {
      // Process removed permissions
      for (const id of removedPermissionIds) {
        await axios.delete(`${API_BASE_URL}/api/rolePermissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Process updated/added permissions. Convert fields array back to comma-separated string.
      for (const perm of editedPermissions) {
        const payload = {
          action: perm.action,
          resource: perm.resource,
          fields: Array.isArray(perm.fields) ? perm.fields.join(",") : perm.fields,
          scope: perm.scope,
        };
        if (perm.id) {
          await axios.put(`${API_BASE_URL}/api/rolePermissions/${perm.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post(`${API_BASE_URL}/api/rolePermissions`, {
            roleId: role.id,
            ...payload,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
      onClose();
    } catch (err) {
      console.error("Error saving permissions", err);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Permissions for {role.name}</DialogTitle>
      <DialogContent>
        {editedPermissions.map((perm, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
          >
            {/* Action Dropdown */}
            <FormControl style={{ marginRight: "8px", minWidth: 120 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={perm.action}
                onChange={(e) => handleFieldChange(index, "action", e.target.value)}
              >
                <MenuItem value="create">Create</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="update">Update</MenuItem>
                <MenuItem value="delete">Delete</MenuItem>
              </Select>
            </FormControl>
            {/* Resource Dropdown */}
            <FormControl style={{ marginRight: "8px", minWidth: 120 }}>
              <InputLabel>Resource</InputLabel>
              <Select
                value={perm.resource}
                onChange={(e) => handleFieldChange(index, "resource", e.target.value)}
              >
                {Object.keys(resourceFields).map((res) =>
                  res !== "*" ? (
                    <MenuItem key={res} value={res}>
                      {res}
                    </MenuItem>
                  ) : null
                )}
                <MenuItem value="*">*</MenuItem>
              </Select>
            </FormControl>
            {/* Fields Multi-Select with Checkboxes */}
            <FormControl style={{ marginRight: "8px", flex: 1 }}>
              <InputLabel>Fields</InputLabel>
              <Select
                multiple
                value={Array.isArray(perm.fields) ? perm.fields : []}
                onChange={(e) => handleFieldsSelect(index, e, perm.resource)}
                renderValue={(selected) =>
                  selected.map(s => s === "*" ? "all" : s).join(", ")
                }
              >
                {(resourceFields[perm.resource] || resourceFields["*"]).map((field) => (
                  <MenuItem key={field} value={field}>
                    <Checkbox checked={perm.fields.indexOf(field) > -1} />
                    <ListItemText primary={field === "*" ? "all" : field} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Scope Dropdown */}
            <FormControl style={{ marginRight: "8px", minWidth: 120 }}>
              <InputLabel>Scope</InputLabel>
              <Select
                value={perm.scope}
                onChange={(e) => handleFieldChange(index, "scope", e.target.value)}
              >
                <MenuItem value="own">Own</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => handleRemoveRow(index)} color="secondary">
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={handleAddRow} variant="outlined" style={{ marginTop: "16px" }}>
          Add Permission
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RolesPage;
