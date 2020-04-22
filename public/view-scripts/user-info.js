function showCurrentUserInfo() {
    $.ajax({
        url: '/user-info',
        success: (form) => {
            loadFormInfo(form);
        },
    });
}

function loadFormInfo(form) {
    Swal.fire({
        title: 'Thông tin của bạn',
        html: form,
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            return changeInfo();
        },
    });
}

async function changeInfo() {
    const formData = new FormData();
    formData.append('phone', $('#phone').val());
    formData.append('gender', $('#gender').val());
    formData.append('age', $('#age').val());

    try {
        let response = await fetch('/update-info', {
            method: 'POST',
            body: formData,
        });
        response = await response.json();

        if (response == 'success') {
            Swal.fire({
                title: 'Thành công',
                icon: 'success',
            });
        } else {
            const errors = response.validationErrors;
            errors.forEach((error) => {
                $('#' + error.param).tooltip({
                    placement: 'bottom',
                    title: error.msg,
                    trigger: 'manual',
                });
                $('#' + error.param).tooltip('show');
                $('#' + error.param).focus(() =>
                    $('#' + error.param).tooltip('hide'),
                );
            });
            return false;
        }    
    } catch (err) {
        location.href = '/500';
    }    
}

async function changePassword() {
    try {
        let response = await fetch('/update-password');
        response = await response.json();
        if(response == 'success') {
            Swal.fire({
                title: 'Thành công',
                text: 'Kiểm tra email của bạn',
                icon: 'success'
            });
        }
        // else location.href = '/500';
    } catch (err) {
        // location.href = '/500';
    }
}
