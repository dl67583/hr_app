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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Checkbox,
  ListItemText,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

const fetchRoles = async (token) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.roles || [];
};

const fetchPermissions = async (token) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/rolePermissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.permissions || [];
};

const RolesPage = () => {
  const { token, permissions: userPermissions = [] } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [roleData, setRoleData] = useState({ name: "", permissions: [] });
  const [availablePermissions, setAvailablePermissions] = useState([]);

  useEffect(() => {
    if (token) {
      fetchPermissions(token).then(setAvailablePermissions);
    }
  }, [token]);

  const {
    data: rolesData = [],
    isLoading,
    error,
  } = useQuery(["roles"], () => fetchRoles(token), {
    enabled: !!token,
  });
  const roleMutation = useMutation(
    async (updatedRole) => {
      let createdRole;

      if (editRole) {
        await axios.put(
          `${API_BASE_URL}/api/roles/${editRole.id}`,
          { name: updatedRole.name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/roles`,
          { name: updatedRole.name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        createdRole = response.data.role;
      }

      // ✅ Ensure new role gets a valid ID
      const roleId = editRole ? editRole.id : createdRole.id;

      for (const perm of updatedRole.permissions) {
        await axios.post(
          `${API_BASE_URL}/api/rolePermissions`,
          { roleId, ...perm },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles"); // ✅ Refresh table after edit
        setEditModalOpen(false);
        setEditRole(null);
        setRoleData({ name: "", permissions: [] });
      },
    }
  );

  const deleteRole = useMutation(
    async (roleId) => {
      await axios.delete(`${API_BASE_URL}/api/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.delete(`${API_BASE_URL}/api/rolePermissions/role/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("roles"); // ✅ Refresh table after delete
      },
    }
  );

  const handleOpenEdit = (role = { id: null, name: "", Permissions: [] }) => {
    setEditRole(role);
    setRoleData({
      id: role?.id || null,
      name: role?.name || "",
      permissions:
        role?.Permissions?.map((p) => ({
          id: p.id,
          action: p.action,
          resource: p.resource,
          fields: p.fields ? p.fields.split(",") : [],
          scope: p.scope,
          roleId: role.id,
        })) || [],
    });

    // ✅ Force a re-render so UI updates properly
    setEditModalOpen(false);
    setTimeout(() => setEditModalOpen(true), 0);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p>Error loading roles: {error.message}</p>;

  return (
    <div className="bg-white border border-[#c5c6c7] h-[calc(100vh-123px)] p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Roles</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenEdit()}
        >
          Add Role
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rolesData.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpenEdit(role)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => deleteRole.mutate(role.id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editModalOpen && (
        <EditRoleDialog
          roleData={roleData}
          setRoleData={setRoleData}
          availablePermissions={availablePermissions}
          token={token} // ✅ Fixing token missing
          onSave={() => roleMutation.mutate(roleData)}
          queryClient={queryClient} // ✅ Pass queryClient
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

// ✅ Fix: Ensure `token` and `roleData` are defined inside `EditRoleDialog`
function EditRoleDialog({
  roleData,
  setRoleData,
  availablePermissions,
  token,
  queryClient,
  onSave,
  onClose,
}) {
  useEffect(() => {
    setEditedPermissions(roleData.permissions || []);
  }, [roleData]);

  const [removedPermissionIds, setRemovedPermissionIds] = useState([]);

  const resourceFields = {
    Users: [
      "*",
      "id",
      "name",
      "surname",
      "username",
      "email",
      "birthday",
      "hourlyPay",
      "departmentId",
    ],
    Roles: ["*", "id", "name", "createdAt", "updatedAt"],
    Departments: ["*", "id", "name", "createdAt", "updatedAt"],
    Requests: ["*", "id", "typeOfRequest", "description", "status"],
    TimeAttendance: ["*", "id", "userId", "checkIn", "checkOut"],
    Leaves: ["*", "id", "type", "description", "userId", "departmentId"],
    "*": ["*"],
  };
  const [editedPermissions, setEditedPermissions] = useState(
    roleData.permissions || []
  );
  const handleFieldChange = (index, field, value) => {
    const updatedPermissions = [...editedPermissions];
    updatedPermissions[index][field] = value;
    setEditedPermissions(updatedPermissions);
  };
  const handleFieldsSelect = (index, event, resource) => {
    let selected = event.target.value;
    const options = resourceFields[resource] || resourceFields["*"];

    if (selected.includes("*") && selected.length < options.length) {
      selected = options;
    }

    handleFieldChange(index, "fields", selected);
  };
  const handleRemoveRow = (index) => {
    const perm = editedPermissions[index];
    if (perm.id) {
      setRemovedPermissionIds((prev) => [...prev, perm.id]); // ✅ Track deleted IDs
    }
    setEditedPermissions(editedPermissions.filter((_, i) => i !== index)); // ✅ Remove from local state
  };

  const handleAddRow = () => {
    setEditedPermissions((prev) => [
      ...prev,
      {
        action: "read",
        resource: "Roles",
        fields: [],
        scope: "own",
        id: null,
        roleId: roleData.id,
      }, // ✅ Ensure roleId is set
    ]);
  };

  const handleSave = async () => {
    try {
      for (const id of removedPermissionIds) {
        await axios.delete(`${API_BASE_URL}/api/rolePermissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      for (const perm of editedPermissions) {
        const payload = {
          roleId: roleData.id,
          action: perm.action,
          resource: perm.resource,
          fields: Array.isArray(perm.fields) ? perm.fields.join(",") : "*",
          scope: perm.scope,
        };

        if (perm.id) {
          await axios.put(
            `${API_BASE_URL}/api/rolePermissions/${perm.id}`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          if (!roleData.id) {
            console.error("❌ ERROR: Role ID is missing!");
            return;
          }

          await axios.post(`${API_BASE_URL}/api/rolePermissions`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      setRemovedPermissionIds([]);

      // ✅ Refresh the table data
      queryClient.invalidateQueries("roles");

      onClose();
    } catch (error) {
      console.error(
        "🔥 Error saving permissions:",
        error.response?.data || error.message
      );
      showAlert(
        "Error!",
        ` ${error.response?.data?.message || error.message}`,
        "error"
      );
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Permissions for {roleData.name}</DialogTitle>
      <DialogContent>
        <TextField
          label="Role Name"
          fullWidth
          variant="outlined"
          margin="normal"
          value={roleData.name}
          onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
        />
        {editedPermissions.map((perm, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            {/* Action Dropdown */}
            <FormControl style={{ marginRight: "8px", minWidth: 120 }}>
              <InputLabel>Action</InputLabel>
              <Select
                value={perm.action}
                onChange={(e) =>
                  handleFieldChange(index, "action", e.target.value)
                }
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
                onChange={(e) =>
                  handleFieldChange(index, "resource", e.target.value)
                }
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
                  selected.map((s) => (s === "*" ? "all" : s)).join(", ")
                }
              >
                {(resourceFields[perm.resource] || resourceFields["*"]).map(
                  (field) => (
                    <MenuItem key={field} value={field}>
                      <Checkbox checked={perm.fields.indexOf(field) > -1} />
                      <ListItemText primary={field === "*" ? "all" : field} />
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            {/* Scope Dropdown */}
            <FormControl style={{ marginRight: "8px", minWidth: 120 }}>
              <InputLabel>Scope</InputLabel>
              <Select
                value={perm.scope}
                onChange={(e) =>
                  handleFieldChange(index, "scope", e.target.value)
                }
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
        <Button
          onClick={handleAddRow}
          variant="outlined"
          style={{ marginTop: "16px" }}
        >
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
