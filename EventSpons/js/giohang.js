var currentUser; // user hiện tại, biến toàn cục
window.onload = function () {
    khoiTao();

    // autocomplete cho khung tim kiem
    autocomplete(document.getElementById('search-box'), list_products);


    currentUser = getCurrentUser();
    addProductToTable(currentUser);
}

function addProductToTable(user) {
    var table = document.getElementsByClassName('listSanPham')[0];

    var s = `
        <tbody>
            <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Đơn vị tổ chức</th>
                <th>Thời gian</th>
                <th>Xóa</th>
            </tr>`;

    if (!user) {
        s += `
            <tr>
                <td colspan="5"> 
                    <h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Bạn chưa đăng nhập !!
                    </h1> 
                </td>
            </tr>
        `;
        table.innerHTML = s;
        return;
    } else if (user.products.length == 0) {
        s += `
            <tr>
                <td colspan="5"> 
                    <h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Sự kiện chọn để tài trợ trống !!
                    </h1> 
                </td>
            </tr>
        `;
        table.innerHTML = s;
        return;
    }

    for (var i = 0; i < user.products.length; i++) {
        var ma = user.products[i].ma;
        var soluongSp = user.products[i].soluong;
        var p = timKiemTheoMa(list_products, ma)
        var thoigian = new Date(user.products[i].date).toLocaleString();

        s += `
            <tr>
                <td>` + (i + 1) + `</td>
                <td class="noPadding imgHide">
                    <a target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
                        ` + p.name + `
                    </a>
                </td>
                <td class="soluong">N/A</td>
                <td style="text-align: center" >` + thoigian + `</td>
                <td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
            </tr>
        `;
    }

    s += `
            <tr style="font-weight:bold; text-align:center">
                <td colspan="4"></td>
                <td class="thanhtoan" onclick="thanhToan()"><a href="https://docs.google.com/forms/d/e/1FAIpQLScIRpVa4irRlRwcMy9hnmyh6fDpLVlGiAzeGLuOJebAda-S8Q/viewform" target="_blank"> Xác nhận </a></td>
            </tr>
        </tbody>
    `;

    table.innerHTML = s;
}


function xoaSanPhamTrongGioHang(i) {
    if (window.confirm('Xác nhận hủy chọn sự kiện này')) {
        currentUser.products.splice(i, 1);
        capNhatMoiThu();
    }
}

function thanhToan() {
    var c_user = getCurrentUser();
    if(c_user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể tài trợ!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
    }
    
    if (!currentUser.products.length) {
        addAlertBox('Không có sự kiện nào cần tài trợ !!', '#ffb400', '#fff', 2000);
        return;
    }
    if (window.confirm('Xác nhận tài trợ ?')) {
        currentUser.donhang.push({
            "sp": currentUser.products,
            "ngaymua": new Date(),
            "tinhTrang": 'Đang chờ xử lý'
        });
        currentUser.products = [];
        capNhatMoiThu();
        addAlertBox('Các sự kiện đã được xác nhận và chờ xử lý.', '#17c671', '#fff', 4000);
        redirect("/")
    }
}
function capNhatMoiThu() { // Mọi thứ
    animateCartNumber();

    // cập nhật danh sách sản phẩm trong localstorage
    setCurrentUser(currentUser);
    updateListUser(currentUser);

    // cập nhật danh sách sản phẩm ở table
    addProductToTable(currentUser);

    // Cập nhật trên header
    capNhat_ThongTin_CurrentUser();
}
