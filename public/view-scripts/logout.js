function showFormLogout() {
    Swal.fire({
        text: 'Bạn muốn đăng xuất ?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            return logout();
        }
    });
}

async function logout() {
    try{
        let response = await fetch('/authentication/logout');
        response = await response.json();
        if(response == 'success') location.href = '/authentication';
        else location.href = '/500';
    }
    catch (err) {
        location.href = '/500';
    }    
}