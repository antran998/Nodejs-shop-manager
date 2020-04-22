function ShowForm(item, type) {
    $.ajax({
        url: '/authentication/' + type,
        success: (form) => {
            LoadForm(item, type, form);
        },
    });
}

async function LoadForm(item, type, form) {
    let title = 'Đăng nhập';
    if (type == 'register') title = 'Đăng ký';
    if (type == 'reset-password') title = 'Đặt lại mật khẩu';

    await Swal.fire({
        title: title,
        html: form,
        width: 600,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            if (type === 'register') return RegisterHandler();
            if (type === 'login') return LoginHandler();
            return ResetPasswordHandler();
        },
        onClose: () => {
            $('#name').tooltip('hide');
            $('#email').tooltip('hide');
            $('#password').tooltip('hide');
            $('#confirm').tooltip('hide');
        },
    });
}

async function RegisterHandler() {
    const formData = new FormData();
    formData.append('name', $('#name').val());
    formData.append('email', $('#email').val());
    formData.append('password', $('#password').val());
    formData.append('confirm', $('#confirm').val());
    try {
        let response = await fetch('/authentication/register', {
            method: 'POST',
            body: formData,
        });
        response = await response.json();
        if (response === 'success') {
            Swal.fire({
                title: 'Thành công!',
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
    } catch (error) {
        location.href = '/500';
    }
}

async function LoginHandler() {
    const formData = new FormData();
    formData.append('email', $('#email').val());
    formData.append('password', $('#password').val());
    try {
        let response = await fetch('/authentication/login', {
            method: 'POST',
            body: formData,
        });
        response = await response.json();
        if (response === 'success') {
            await Swal.fire({
                title: 'Thành công!',
                icon: 'success',                
            });
            location.href = '/admin/category-manager';
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
    } catch (error) {
        location.href = '/500';
    }
}

async function ResetPasswordHandler() {
    const formData = new FormData();
    formData.append('email', $('#email').val());
    try {
        let response = await fetch('/authentication/reset-password', {
            method: 'POST',
            body: formData,
        });
        response = await response.json();
        if (response === 'success') {
            Swal.fire({
                title: 'Thành công!',
                text: 'Hãy kiểm tra email để reset mật khẩu',
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
    } catch (error) {
        location.href = '/500';
    }
}
