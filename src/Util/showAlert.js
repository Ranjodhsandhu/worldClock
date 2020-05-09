// import React from 'react';
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

export function showAlertForResponse(ico,title,text){
    return Swal.fire({
        title: `<pre>${title}</pre>`,
        icon: ico,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `${text}`,
        customClass: {
            popup: 'show-alert'
        }
    })
}
export default showAlert;