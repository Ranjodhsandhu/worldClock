import Swal from 'sweetalert2';;

function showAlert(ico,titleText,time){
    Swal.fire({
        icon: ico,
        title: titleText,
        timer: time,
        showConfirmButton: false
    }
    );
}

export default showAlert;