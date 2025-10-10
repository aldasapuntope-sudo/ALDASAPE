import Swal from 'sweetalert2';

const AlertSwal = ({ icon = 'info', title = '', text = '', timer = 0, showConfirmButton = true }) => {
  Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton,
    confirmButtonColor: '#28a745', // verde estilo bootstrap
    customClass: {
      popup: 'rounded-4 shadow-lg',
      title: 'fw-bold',
      confirmButton: 'btn btn-success'
    },
  });
};

export default AlertSwal;
