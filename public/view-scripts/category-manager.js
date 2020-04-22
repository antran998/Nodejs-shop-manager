async function showForm(type, item = null) {
    let title = 'Thêm danh mục mới';
    let id = '';
    let name = '';
    let code = '';
    let description = '';
    let image = '/dist/img/item.png';
    if (type == 'update') {
        title = 'Cập nhật danh mục';
        id = $(item).attr('data-id');
        let category = await fetch('/admin/category-manager/category?id=' + id);
        category = await category.json();
        name = category.name;
        code = category.code;
        description = category.description;
        if (category.image !== '\\') image = category.image;
    }
    Swal.fire({
        title: title,
        width: 600,
        html: `            
            <div class="row">
                <div class="col-md-6 form-group">                    
                    <img src="${image}" id="imagePreview" alt="Ảnh danh mục" class="img-create" height="200" width="200">
                </div>
                <div class="col-md-6 form-group">
                    <input class="form-control" hidden id="idCate" name="id" value="${id}">                    
                    <input class="form-control" id="nameCate" name="name" placeholder="Tên" value="${name}">                    
                    <input class="form-control mt-10" id="codeCate" name="code" placeholder="Mã" value="${code}">
                    <input class="form-control mt-10" id="description" name="description" placeholder="Ghi chú" value="${description}">
                    <input class="form-control mt-10" type="file" onchange="readURL(this,'#imagePreview')" name="image" id="image">
                </div>
            </div>
            `,
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        preConfirm: async () => {
            const fileInput = document.getElementById('image');
            const formData = new FormData();
            formData.append('id', $('#idCate').val());
            formData.append('name', $('#nameCate').val());
            formData.append('code', $('#codeCate').val());
            formData.append('description', $('#description').val());
            formData.append('image', fileInput.files[0]);
            formData.append('type', type);
            try {
                let response;
                if (type === 'create') {
                    response = await fetch(
                        `/admin/category-manager/add-category`,
                        {
                            method: 'POST',
                            body: formData,
                        },
                    );
                } else {
                    response = await fetch(
                        `/admin/category-manager/update-category`,
                        {
                            method: 'POST',
                            body: formData,
                        },
                    );
                }
                response = await response.json();
                if (response === 'success') {
                    Swal.fire({
                        title: 'Thành công',
                        icon: 'success',
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    response.validationErrors.forEach((error) => {
                        switch (error.param) {
                            case 'name':
                                $('#nameCate').tooltip({
                                    placement: 'left',
                                    title: error.msg,
                                    trigger: 'manual',
                                });
                                $('#nameCate').tooltip('show');
                                $('#nameCate').focus(() =>
                                    $('#nameCate').tooltip('hide'),
                                );
                                break;
                            case 'code':
                                $('#codeCate').tooltip({
                                    placement: 'left',
                                    title: error.msg,
                                    trigger: 'manual',
                                });
                                $('#codeCate').tooltip('show');
                                $('#codeCate').focus(() =>
                                    $('#codeCate').tooltip('hide'),
                                );
                                break;
                        }
                    });
                    return false;
                }
            } catch (error) {
                // Swal.showValidationMessage(`Request failed: ${error}`);
                location.href = '/500';
            }
        },
        onClose: () => {
            $('#nameCate').tooltip('hide');
            $('#codeCate').tooltip('hide');
        },
    });
}

function readURL(input, preview) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(preview).attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

async function showDelete(item) {
    const id = $(item).attr('data-id');
    Swal.fire({
        title: 'Bạn muốn xóa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            try {
                let response = await fetch(
                    '/admin/category-manager/delete-category?id=' + id,
                    {
                        method: 'DELETE',
                    },
                );
                response = await response.json();
                if (response === 'success') {
                    await Swal.fire({
                        title: 'Thành công',
                        icon: 'success',
                    });
                    location.reload();
                }
            } catch (err) {
                location.href = '/500';
            }
        },
    });
}
