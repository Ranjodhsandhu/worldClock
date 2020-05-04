import Swal from 'sweetalert2';;
// function component to show sweet alert message on call
function showAlert(ico,titleText,time){
    Swal.fire({
        icon: ico,
        title: `<pre> ${titleText} </pre>`,
        timer: time,
        showConfirmButton: false,
        customClass: {
            popup: 'show-alert'
        }
    }
    );
}

export default showAlert;