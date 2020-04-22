function pagingUrl(
    currPage = '1',
    searchField = 'name',
    searchValue = '',
    orderField = 'createdAt',
    orderDir = 'desc',
    optionField = '0',
    optionValue = '0'
) {
    let url = `/admin/product-manager/products?currPage=${currPage}`;
    url += `&&searchField=${searchField}`;
    url += `&&searchValue=${searchValue}`;
    url += `&&orderField=${orderField}`;
    url += `&&orderDir=${orderDir}`;
    url += `&&optionField=${optionField}`;
    url += `&&optionValue=${optionValue}`;
    return url;
}

$(function () {
    $('#productSection').load(pagingUrl());
});

function showForm(item = null) {
    let url = '/admin/product-manager/get-form';
    if (item != null) {
        url = '/admin/product-manager/get-form?id=' + $(item).attr('data-id');
    }
    $.ajax({
        url: url,
        success: (form) => {
            loadForm(item, form);
        },
    });
}

function loadForm(item, form) {
    const title = item != null ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm';
    Swal.fire({
        title: title,
        width: 800,
        html: form,
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        preConfirm: async () => {
            const fileInput = document.getElementById('image');

            const formData = new FormData();
            formData.append('name', $('#name').val());
            formData.append('price', $('#price').val());
            formData.append('cateId', $('#cateId').val());
            formData.append('size', $('#size').val());
            formData.append('color', $('#color').val());
            formData.append('image', fileInput.files[0]);

            let response;
            if (item != null) {
                formData.append('id', $(item).attr('data-id'));
                response = await fetch(
                    '/admin/product-manager/update-product',
                    {
                        method: 'POST',
                        body: formData,
                    },
                );
            } else {
                response = await fetch('/admin/product-manager/add-product', {
                    method: 'POST',
                    body: formData,
                });
            }
            response = await response.json();
            if (response == 'success') {
                return Swal.fire({
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

function deleteForm(item) {
    Swal.fire({
        title: 'Bạn muốn xóa ?',
        icon: 'warning',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        preConfirm: async () => {
            try {
                let response = await fetch(
                    '/admin/product-manager/delete-product?id=' +
                        $(item).attr('data-id'),
                    {
                        method: 'DELETE',
                    },
                );
                response = await response.json();
                if (response == 'success') {
                    return Swal.fire({
                        title: 'Thành công',
                        icon: 'success',
                    });
                } else {
                    // location.href = '/500'
                }
            } catch (err) {
                // location.href = '/500'
            }
        },
    });
}

function pagingHandler(pageNumber = 1) {
    const searchValue = $('#searchInput').val();
    const categoryId = $('#categorySelect').val();
    if (categoryId == 0) {
        $('#productSection').load(pagingUrl(pageNumber,'name', searchValue));
    } else {
        $('#productSection').load(
            pagingUrl(pageNumber,'name', searchValue,'createdAt','desc','categoryId',categoryId),
        );
    }
}

function numberHandler(item) {    
    const pageNumber = $(item).find('.page-link').html();
    pagingHandler(pageNumber); 
}

function nextPrevHandler(item) {
    let pageNumber = $('li.page-item.active').find('.page-link').html();    
    if($(item).find('.sr-only').html() == 'Next') {
        pageNumber = parseInt(pageNumber) + 1;
        
    } else {
        pageNumber = parseInt(pageNumber) - 1;
    }
    pagingHandler(pageNumber);
}