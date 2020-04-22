$(function () {
    $('#roleSection').load('/admin/role-manager/get-roles');
});

function showForm(type, item = null) {
    let roleId = '';
    if (item != null) roleId = '?id=' + $(item).attr('data-role-id');
    $.ajax({
        url: '/admin/role-manager/get-commands' + roleId,
        success: (form) => {
            loadForm(type, item, form);
        },
    });
}

let choose;
let remove;

async function loadForm(type, item, form) {
    choose = [];
    remove = [];
    const title = type == 'update' ? 'Câp nhật vai trò' : 'Thêm vai trò';
    await Swal.fire({
        title: title,
        html: form,
        width: 600,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Cập nhật',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const name = $('#roleName').val();
            let url;
            const request = {
                name: name,
                choose: choose,
                remove: remove,
            };
            if (type === 'update') {
                url = '/admin/role-manager/update-role';
                request.id = $(item).attr('data-role-id');
            } else url = '/admin/role-manager/add-role';
            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request),
                });
                response = await response.json();
                if (response != 'success') {
                    const error = response.validationErrors[0];
                    $('#roleName').tooltip({
                        placement: 'top',
                        title: error.msg,
                        trigger: 'manual',
                    });
                    $('#roleName').tooltip('show');
                    $('#roleName').focus(() => $('#roleName').tooltip('hide'));
                    return false;
                } else {
                    Swal.fire({
                        title: 'Thành công',
                        icon: 'success',
                    }).then(() => {
                        location.reload();
                    });
                }
            } catch (err) {
                location.href = '/500';
            }
        },
        allowOutsideClick: false,
        onClose: () => {
            $('#roleName').tooltip('hide');
        },
    });
}

function handleClickCmd(item) {
    if ($(item).hasClass('border-gray')) {
        // add check
        $(item).removeClass('border-gray');
        $(item).addClass('border-primary');

        const id = $(item).attr('data-id');
        if (remove.indexOf(id) !== -1) {
            remove.splice(remove.indexOf(id), 1);
        } else {
            choose.push(id);
        }
    } else {
        // remove check
        $(item).removeClass('border-primary');
        $(item).addClass('border-gray');

        const id = $(item).attr('data-id');
        if (choose.indexOf(id) !== -1) {
            choose.splice(choose.indexOf(id), 1);
        } else {
            remove.push(id);
        }
    }
}

async function showFormDelete(item) {
    const id = $(item).attr('data-role-id');
    await Swal.fire({
        title: 'Bạn muốn xóa',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        confirmButtonColor: '#d33',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            try {
                let response = await fetch(
                    '/admin/role-manager/delete-role?id=' + id,
                    {
                        method: 'DELETE',
                    },
                );
                response = await response.json();
                Swal.fire({
                    title: 'Thành công',
                    icon: 'success',
                }).then(() => {
                    location.reload();
                });
            } catch (err) {
                location.href = '/500';
            }
        },
    });
}
