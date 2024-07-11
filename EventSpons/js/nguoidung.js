var tongTienTatCaDonHang = 0; // lưu tổng tiền từ tất cả các đơn hàng đã mua
var tongSanPhamTatCaDonHang = 0;

window.onload = function () {
    khoiTao();

    // autocomplete cho khung tim kiem
    autocomplete(document.getElementById('search-box'), list_products);

    currentUser = getCurrentUser();

    if (currentUser) {
        // cập nhật từ list user, do trong admin chỉ tác động tới listuser
        var listUser = getListUser();
        for (var u of listUser) {
            if (equalUser(currentUser, u)) {
                currentUser = u;
                setCurrentUser(u);
                break;
            }
        }

        addTatCaDonHang(currentUser); // hàm này cần chạy trước để tính được tổng tiền tất cả đơn hàng 
        addInfoUser(currentUser);

    } else {
        var warning = `<h2 style="color: red; font-weight:bold; text-align:center; font-size: 2em; padding: 50px;">
                            Bạn chưa đăng nhập !!
                        </h2>`;
        document.getElementsByClassName('infoUser')[0].innerHTML = warning;
    }
}

// Phần Thông tin người dùng
function addInfoUser(user) {
    if (!user) return;
    document.getElementsByClassName('infoUser')[0].innerHTML = `
    <hr>
    <table>
        <tr>
            <th colspan="3">THÔNG TIN NGƯỜI DÙNG</th>
        </tr>
        <tr>
            <td>Tài khoản: </td>
            <td> <input type="text" value="` + user.username + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'username')"></i> </td>
        </tr>
        <tr>
            <td>Mật khẩu: </td>
            <td style="text-align: center;"> 
                <i class="fa fa-pencil" id="butDoiMatKhau" onclick="openChangePass()"> Đổi mật khẩu</i> 
            </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" id="khungDoiMatKhau">
                <table>
                    <tr>
                        <td> <div>Mật khẩu cũ:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Mật khẩu mới:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Xác nhận mật khẩu:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> 
                            <div><button onclick="changePass()">Đồng ý</button></div> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Họ: </td>
            <td> <input type="text" value="` + user.ho + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ho')"></i> </td>
        </tr>
        <tr>
            <td>Tên: </td>
            <td> <input type="text" value="` + user.ten + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ten')"></i> </td>
        </tr>
        <tr>
            <td>Email: </td>
            <td> <input type="text" value="` + user.email + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'email')"></i> </td>
        </tr>
        <tr>
            <td colspan="3" style="padding:5px; border-top: 2px solid #ccc;"></td>
        </tr>
        <tr>
            <td>Số lượng sự kiện đã tài trợ: </td>
            <td> <input type="text" value="` + tongSanPhamTatCaDonHang + `" readonly> </td>
            <td></td>
        </tr>
    </table>`;
}

function openChangePass() {
    var khungChangePass = document.getElementById('khungDoiMatKhau');
    var actived = khungChangePass.classList.contains('active');
    if (actived) khungChangePass.classList.remove('active');
    else khungChangePass.classList.add('active');
}

function changePass() {
    var khungChangePass = document.getElementById('khungDoiMatKhau');
    var inps = khungChangePass.getElementsByTagName('input');
    var oldPass = inps[0].value.trim();
    var newPass = inps[1].value.trim();
    var confirmPass = inps[2].value.trim();

    if (oldPass !== currentUser.pass) {
        alert('Mật khẩu cũ không đúng !!');
        inps[0].focus();
        return;
    }

    if (newPass === '') {
        alert('Chưa nhập mật khẩu mới !!');
        inps[1].focus();
        return;
    }

    if (newPass !== confirmPass) {
        alert('Mật khẩu xác nhận không khớp !!');
        inps[2].focus();
        return;
    }

    currentUser.pass = newPass;
    setCurrentUser(currentUser);

    // Thông báo thành công
    addAlertBox('Đổi mật khẩu thành công.', '#5f5', '#000', 4000);

    // Đóng khung đổi mật khẩu
    openChangePass();
}

function changeInfo(iTag, info) {
    var inp = iTag.parentElement.previousElementSibling.getElementsByTagName('input')[0];

    // Đang hiển thị input để chỉnh sửa
    if (!inp.readOnly && inp.value !== '') {
        var users = getListUser();
        var temp = copyObject(currentUser);

        // Kiểm tra thông tin đã tồn tại cho user khác
        if (info === 'username') {
            for (var u of users) {
                if (u.username === inp.value && u.username !== currentUser.username) {
                    alert('Tên tài khoản đã có người sử dụng !!');
                    inp.value = currentUser.username;
                    return;
                }
            }
        } else if (info === 'email') {
            for (var u of users) {
                if (u.email === inp.value && u.username !== currentUser.username) {
                    alert('Email đã có người sử dụng !!');
                    inp.value = currentUser.email;
                    return;
                }
            }
        }

        // Cập nhật thông tin user mới
        currentUser[info] = inp.value;
        setCurrentUser(currentUser);
        updateListUser(temp, currentUser);

        // Cập nhật trên header
        capNhat_ThongTin_CurrentUser();

        // Đổi nút từ "Đồng ý" sang rỗng
        iTag.innerHTML = '';

    } else {
        // Hiển thị nút "Đồng ý" để bắt đầu chỉnh sửa
        iTag.innerHTML = 'Đồng ý';
        inp.focus();
        var v = inp.value;
        inp.value = '';
        inp.value = v;
    }

    // Đảo ngược trạng thái chỉnh sửa thông tin
    inp.readOnly = !inp.readOnly;
}

// Phần thông tin đơn hàng
function addTatCaDonHang(user) {
    var div = document.getElementsByClassName('listDonHang')[0];
    div.innerHTML = ''; // Xóa nội dung đơn hàng cũ

    if (!user) {
        div.innerHTML = `
            <h3 style="width=100%; padding: 50px; color: red; font-size: 2em; text-align: center"> 
                Bạn chưa đăng nhập !!
            </h3>`;
        return;
    }

    var listDonHang = user.donhang || []; // Giả sử danh sách đơn hàng của người dùng được lưu trong thuộc tính donhang

    listDonHang.forEach(function (dh, index) {
        addDonHang(dh, index + 1);
    });
}
 function addDonHang(dh, index) {
        var div = document.getElementsByClassName('listDonHang')[0];
    
        var s = `
            <table class="listSanPham">
                <tr> 
                    <th colspan="6">
                        <h3 style="text-align:center;"> Sự kiện ngày: ${new Date(dh.ngaymua).toLocaleString()}</h3> 
                    </th>
                </tr>
                <tr>
                    <th>STT</th>
                    <th>Sự kiện</th>
                    <th>Đơn vị tổ chức</th>
                    <th>Thời gian thêm để tài trợ</th> 
                    <th>Trạng thái</th>
                </tr>`;
    
        var totalPrice = 0;
        dh.sp.forEach(function (sp, idx) {
            var p = timKiemTheoMa(list_products, sp.ma);
            var price = p.promo && p.promo.name === 'giareonline' ? p.promo.value : p.price;
            var thanhtien = price * sp.soluong;
            totalPrice += thanhtien;
    
            s += `
                <tr>
                    <td>${idx + 1}</td>
                    <td class="noPadding imgHide" style="text-align: center">
                        <a target="_blank" href="chitietsanpham.html?${p.name.split(' ').join('-')}" title="Xem chi tiết">
                            ${p.name}
                        </a>
                    </td>
                    <td class="soluong">N/A</td>
                    <td style="text-align: center">${new Date(sp.date).toLocaleString()}</td>
                    <td style="text-align: center">${dh.tinhTrang}</td>
                </tr>`;
        });
    
        s += ``;
    
        div.innerHTML += s;
    
        tongSanPhamTatCaDonHang += dh.sp.reduce((acc, curr) => acc + curr.soluong, 0);
    }
    
