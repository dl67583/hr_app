import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
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

const fetchPayments = async (token) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.payments;
};

const fetchUsers = async (token) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.users;
};

const PaymentsPage = () => {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    month: "",
    year: "",
    hoursWorked: "",
    totalPayment: "",
  });

  const { data: payments = [], isLoading } = useQuery(
    "payments",
    () => fetchPayments(token),
    { enabled: !!token }
  );

  const { data: users = [] } = useQuery("users", () => fetchUsers(token), {
    enabled: !!token,
  });

  const mutation = useMutation(
    async (paymentData) => {
      if (editPayment) {
        return axios.put(
          `${API_BASE_URL}/api/payments/${editPayment.id}`,
          paymentData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        return axios.post(`${API_BASE_URL}/api/payments`, paymentData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("payments");
        setOpen(false);
        setEditPayment(null);
      },
    }
  );

  const deletePayment = useMutation(
    async (id) => {
      return axios.delete(`${API_BASE_URL}/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("payments"),
    }
  );

  const handleOpen = (payment = null) => {
    setEditPayment(payment);
    setFormData(
      payment || {
        userId: "",
        month: "",
        year: "",
        hoursWorked: "",
        totalPayment: "",
      }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <h2>Payments</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Payment
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Hours Worked</TableCell>
            <TableCell>Total Payment</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {users.find((u) => u.id === payment.userId)?.name || "Unknown"}
              </TableCell>
              <TableCell>{payment.month}</TableCell>
              <TableCell>{payment.year}</TableCell>
              <TableCell>{payment.hoursWorked}</TableCell>
              <TableCell>${payment.totalPayment.toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(payment)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => deletePayment.mutate(payment.id)}
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editPayment ? "Edit Payment" : "Add Payment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="User"
            name="userId"
            select
            fullWidth
            value={formData.userId}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Month"
            name="month"
            type="number"
            fullWidth
            value={formData.month}
            onChange={handleChange}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            fullWidth
            value={formData.year}
            onChange={handleChange}
          />
          <TextField
            label="Hours Worked"
            name="hoursWorked"
            type="number"
            fullWidth
            value={formData.hoursWorked}
            onChange={handleChange}
          />
          <TextField
            label="Total Payment"
            name="totalPayment"
            type="number"
            fullWidth
            value={formData.totalPayment}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editPayment ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
