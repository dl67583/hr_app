import { useState } from "react";
import { Dialog, TextField, Button } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";

const UserModal = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const { mutate } = useMutation(() => axios.post("/api/users", { name }), {
    onSuccess: () => {
      refetch();
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add User</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={() => mutate()}>Save</Button>
      </Dialog>
    </>
  );
};

export default UserModal;
