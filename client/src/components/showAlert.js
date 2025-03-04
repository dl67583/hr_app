import Swal from "sweetalert2";

const showAlert = (title, text, type = "info", timeout = 3000) => {
  Swal.fire({
    title,
    text,
    icon: type,
    timer: timeout,
    showConfirmButton: true, // Ensures "OK" button is always present
    confirmButtonText: "OK",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

export default showAlert;
