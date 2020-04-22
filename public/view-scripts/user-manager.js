$(function () {
    $('#userTable').DataTable({
        responsive: true,
        autoWidth: false,
        language: {
            search: '',
            searchPlaceholder: 'Tìm kiếm',
            sLengthMenu: '_MENU_dòng',
            info: 'Hiện trang _PAGE_ trong _PAGES_ trang',
            paginate: {
                previous: ' < ',
                next: ' > ',
            },
        },
        lengthMenu: [5, 10, 25],
        processing: true,
        serverSide: true,
        ajax: {
            url: `/admin/user-manager/get-users`,
        },
        columns: [
            { data: 'email' },
            { data: 'name' },
            { data: 'phone' },
            { data: 'age' },
            { data: 'gender' },
            {
                data: 'id',
                render: function (data, type, row) {
                    return `<button class="btn btn-info" onclick="ShowForm(this);" data-id="${data}">Chi tiết</button>`;
                },
            },
        ],
    });
});

async function LoadData() {
    let response = await fetch('/admin/user-manager/get-users');
    response = response.json();
    return response;
}

function ShowForm(item) {
    $.ajax({
        url: '/admin/user-manager/get-user-info?id=' + $(item).attr('data-id'),
        success: (response) => {
            LoadForm($(item).attr('data-id'), response);
        },
    });
}

let choose;
let remove;
let inUseRole;

function LoadForm(id, form) {
    choose = []; 
    remove = [];
    Swal.fire({
        title: 'Chi tiết người dùng',
        html: form,
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        preConfirm: async () => {
            try {
                const newRoles = $('#role_tags').val();                
                for(const item of newRoles) {
                    if(inUseRole[item] === undefined) {
                        choose.push(item);
                    } else {
                        delete inUseRole[item];
                    }
                }
                for(const property in inUseRole) {
                    remove.push(property);
                }
                const formData = new FormData();
                formData.append("id", id);
                formData.append('name', $('#name').val());
                formData.append('phone', $('#phone').val());
                formData.append('age', $('#age').val());
                formData.append('gender', $('#gender').val());
                formData.append("choose", choose);
                formData.append('remove', remove);

                let response = await fetch('/admin/user-manager/update-user', {
                    method: 'POST',
                    body: formData
                })
                response = await response.json();
                if(response === 'success') {
                    Swal.fire({
                        title:'Thành công!',
                        icon: 'success'
                    })
                } else {
                    const errors = response.validationErrors;
                    errors.forEach(error => {
                        $('#' + error.param).tooltip({
                            placement: 'bottom',
                            title: error.msg,
                            trigger: 'manual',
                        });
                        $('#' + error.param).tooltip('show');
                        $('#' + error.param).focus(() =>
                            $('#' + error.param).tooltip('hide'),
                        );
                    })       
                }
                return false;
            } catch (err) {
                // location.href = '/500';
            }
        },
        onBeforeOpen: () => {
            $('.select2').select2();
            $('#role_tags').select2({
                tags: true,
                tokenSeparators: [',', ' '],
            });
            const roles = $('#role_tags').val();            
            inUseRole = {};
            for(const item of roles) {
                inUseRole[item] = 1;
            }
        }
    });    
}