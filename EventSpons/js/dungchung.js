var adminInfo = [{
    "username": "admin",
    "pass": "adadad"
}];

function getListAdmin() {
    return JSON.parse(window.localStorage.getItem('ListAdmin'));
}

function setListAdmin(l) {
    window.localStorage.setItem('ListAdmin', JSON.stringify(l));
}


// Hàm khởi tạo, tất cả các trang đều cần
function khoiTao() {
    // get data từ localstorage
    /*list_products = getListProducts() || list_products;*/
    adminInfo = getListAdmin() || adminInfo;

    setupEventTaiKhoan();
    capNhat_ThongTin_CurrentUser();
    addEventCloseAlertButton();
}

// ========= Các hàm liên quan tới danh sách sản phẩm =========
// Localstorage cho dssp: 'ListProducts
function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}


function timKiemTheoMa(list, ma) {
    for (var l of list) {
        if (l.ma == ma) return l;
    }
}

// copy 1 object, do trong js ko có tham biến , tham trị rõ ràng
// nên dùng bản copy để chắc chắn ko ảnh hưởng tới bản chính
function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

// ============== ALert Box ===============
// div có id alert được tạo trong hàm addFooter
function addAlertBox(text, bgcolor, textcolor, time) {
    var al = document.getElementById('alert');
    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.opacity = 1;
    al.style.zIndex = 200;

    if (textcolor) al.style.color = textcolor;
    if (time)
        setTimeout(function () {
            al.style.opacity = 0;
            al.style.zIndex = 0;
        }, time);
}

function addEventCloseAlertButton() {
    document.getElementById('closebtn')
        .addEventListener('mouseover', (event) => {
            // event.target.parentElement.style.display = "none";
            event.target.parentElement.style.opacity = 0;
            event.target.parentElement.style.zIndex = 0;
        });
}

// ================ Cart Number + Thêm vào Giỏ hàng ======================
function animateCartNumber() {
    // Hiệu ứng cho icon giỏ hàng
    var cn = document.getElementsByClassName('cart-number')[0];
    cn.style.transform = 'scale(2)';
    cn.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    cn.style.color = 'white';
    setTimeout(function () {
        cn.style.transform = 'scale(1)';
        cn.style.backgroundColor = 'transparent';
        cn.style.color = 'red';
    }, 1200);
}

function themVaoGioHang(ma, tensp) {
    var user = getCurrentUser();
    if (!user) {
        alert('Bạn cần đăng nhập !');
        showTaiKhoan(true);
        return;
    }
    if (user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể tài trợ!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
    }
    var t = new Date();
    var daCoSanPham = false;;

    for (var i = 0; i < user.products.length; i++) { // check trùng sản phẩm
        if (user.products[i].ma == ma) {
            user.products[i].soluong++;
            daCoSanPham = true;
            break;
        }
    }

    if (!daCoSanPham) { // nếu không trùng thì mới thêm sản phẩm vào user.products
        user.products.push({
            "ma": ma,
            "soluong": 1,
            "date": t
        });
    }

    animateCartNumber();
    addAlertBox('Đã thêm ' + tensp + ' vào sự kiện để tài trợ.', '#17c671', '#fff', 3500);

    setCurrentUser(user); // cập nhật giỏ hàng cho user hiện tại
    updateListUser(user); // cập nhật list user
    capNhat_ThongTin_CurrentUser(); // cập nhật giỏ hàng
}

// ============================== TÀI KHOẢN ============================

// Hàm get set cho người dùng hiện tại đã đăng nhập
function getCurrentUser() {
    return JSON.parse(window.localStorage.getItem('CurrentUser')); // Lấy dữ liệu từ localstorage
}

function setCurrentUser(u) {
    window.localStorage.setItem('CurrentUser', JSON.stringify(u));
}

// Hàm get set cho danh sách người dùng
function getListUser() {
    var data = JSON.parse(window.localStorage.getItem('ListUser')) || []
    var l = [];
    for (var d of data) {
        l.push(d);
    }
    return l;
}

function setListUser(l) {
    window.localStorage.setItem('ListUser', JSON.stringify(l));
}

// Sau khi chỉnh sửa 1 user 'u' thì cần hàm này để cập nhật lại vào ListUser
function updateListUser(u, newData) {
    var list = getListUser();
    for (var i = 0; i < list.length; i++) {
        if (equalUser(u, list[i])) {
            list[i] = (newData ? newData : u);
        }
    }
    setListUser(list);
}

function logIn(form) {
    // Lấy dữ liệu từ form
    var name = form.username.value;
    var pass = form.pass.value;
    var newUser = new User(name, pass);

    // Lấy dữ liệu từ danh sách người dùng localstorage
    var listUser = getListUser();

    // Kiểm tra xem dữ liệu form có khớp với người dùng nào trong danh sách ko
    for (var u of listUser) {
        if (equalUser(newUser, u)) {
            if(u.off) {
                alert('Tài khoản này đang bị khoá. Không thể đăng nhập.');
                return false;
            }

            setCurrentUser(u);

            // Reload lại trang -> sau khi reload sẽ cập nhật luôn giỏ hàng khi hàm setupEventTaiKhoan chạy
            location.reload();
            return false;
        }
    }

    // Đăng nhập vào admin
    for (var ad of adminInfo) {
        if (equalUser(newUser, ad)) {
            alert('Xin chào admin .. ');
            window.localStorage.setItem('admin', true);
            window.location.assign('admin.html');
            return false;
        }
    }

    // Trả về thông báo nếu không khớp
    alert('Nhập sai tên hoặc mật khẩu !!!');
    form.username.focus();
    return false;
}

function signUp(form) {
    var ho = form.ho.value;
    var ten = form.ten.value;
    var email = form.email.value;
    var username = form.newUser.value;
    var pass = form.newPass.value;
    var newUser = new User(username, pass, ho, ten, email);

    // Lấy dữ liệu các khách hàng hiện có
    var listUser = getListUser();

    // Kiểm tra trùng admin
    for (var ad of adminInfo) {
        if (newUser.username == ad.username) {
            alert('Tên đăng nhập đã có người sử dụng !!');
            return false;
        }
    }

    // Kiểm tra xem dữ liệu form có trùng với khách hàng đã có không
    for (var u of listUser) {
        if (newUser.username == u.username) {
            alert('Tên đăng nhập đã có người sử dụng !!');
            return false;
        }
    }

    // Lưu người mới vào localstorage
    listUser.push(newUser);
    window.localStorage.setItem('ListUser', JSON.stringify(listUser));

    // Đăng nhập vào tài khoản mới tạo
    window.localStorage.setItem('CurrentUser', JSON.stringify(newUser));
    alert('Đăng kí thành công, Bạn sẽ được tự động đăng nhập!');
    location.reload();

    return false;
}

function logOut() {
    window.localStorage.removeItem('CurrentUser');
    location.reload();
}

// Hiển thị form tài khoản, giá trị truyền vào là true hoặc false
function showTaiKhoan(show) {
    var value = (show ? "scale(1)" : "scale(0)");
    var div = document.getElementsByClassName('containTaikhoan')[0];
    div.style.transform = value;
}

// Check xem có ai đăng nhập hay chưa (CurrentUser có hay chưa)
// Hàm này chạy khi ấn vào nút tài khoản trên header
function checkTaiKhoan() {
    if (!getCurrentUser()) {
        showTaiKhoan(true);
    }
}

// Tạo event, hiệu ứng cho form tài khoản
function setupEventTaiKhoan() {
    var taikhoan = document.getElementsByClassName('taikhoan')[0];
    var list = taikhoan.getElementsByTagName('input');

    // Tạo eventlistener cho input để tạo hiệu ứng label
    // Gồm 2 event onblur, onfocus được áp dụng cho từng input trong list bên trên
    ['blur', 'focus'].forEach(function (evt) {
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener(evt, function (e) {
                var label = this.previousElementSibling; // lấy element ĐỨNG TRƯỚC this, this ở đây là input
                if (e.type === 'blur') { // khi ấn chuột ra ngoài
                    if (this.value === '') { // không có value trong input thì đưa label lại như cũ
                        label.classList.remove('active');
                        label.classList.remove('highlight');
                    } else { // nếu có chữ thì chỉ tắt hightlight chứ không tắt active, active là dịch chuyển lên trên
                        label.classList.remove('highlight');
                    }
                } else if (e.type === 'focus') { // khi focus thì label active + hightlight
                    label.classList.add('active');
                    label.classList.add('highlight');
                }
            });
        }
    })

    // Event chuyển tab login-signup
    var tab = document.getElementsByClassName('tab');
    for (var i = 0; i < tab.length; i++) {
        var a = tab[i].getElementsByTagName('a')[0];
        a.addEventListener('click', function (e) {
            e.preventDefault(); // tắt event mặc định

            // Thêm active(màu xanh lá) cho li chứa tag a này => ấn login thì login xanh, signup thì signup sẽ xanh
            this.parentElement.classList.add('active');

            // Sau khi active login thì phải tắt active sigup và ngược lại
            // Trường hợp a này thuộc login => <li>Login</li> sẽ có nextElement là <li>SignUp</li>
            if (this.parentElement.nextElementSibling) {
                this.parentElement.nextElementSibling.classList.remove('active');
            }
            // Trường hợp a này thuộc signup => <li>SignUp</li> sẽ có .previousElement là <li>Login</li>
            if (this.parentElement.previousElementSibling) {
                this.parentElement.previousElementSibling.classList.remove('active');
            }

            // Ẩn phần nhập của login nếu ấn signup và ngược lại
            // href của 2 tab signup và login là #signup và #login -> tiện cho việc getElement dưới đây
            var target = this.href.split('#')[1];
            document.getElementById(target).style.display = 'block';

            var hide = (target == 'login' ? 'signup' : 'login');
            document.getElementById(hide).style.display = 'none';
        })
    }

    // Đoạn code tạo event trên được chuyển về js thuần từ code jquery
    // Code jquery cho phần tài khoản được lưu ở cuối file này
}

// Cập nhật số lượng hàng trong giỏ hàng + Tên current user
function capNhat_ThongTin_CurrentUser() {
    var u = getCurrentUser();
    if (u) {
        // Cập nhật số lượng hàng vào header
        document.getElementsByClassName('cart-number')[0].innerHTML = getTongSoLuongSanPhamTrongGioHang(u);
        // Cập nhật tên người dùng
        document.getElementsByClassName('member')[0]
            .getElementsByTagName('a')[0].childNodes[2].nodeValue = ' ' + u.username;
        // bỏ class hide của menu người dùng
        document.getElementsByClassName('menuMember')[0]
            .classList.remove('hide');
    }
}

// tính tổng số lượng các sản phẩm của user u truyền vào
function getTongSoLuongSanPhamTrongGioHang(u) {
    var soluong = 0;
    for (var p of u.products) {
        soluong += p.soluong;
    }
    return soluong;
}

// lấy số lương của sản phẩm NÀO ĐÓ của user NÀO ĐÓ được truyền vào
function getSoLuongSanPhamTrongUser(tenSanPham, user) {
    for (var p of user.products) {
        if (p.name == tenSanPham)
            return p.soluong;
    }
    return 0;
}

// ==================== Những hàm khác ===================== 
function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}

// https://www.w3schools.com/howto/howto_js_autocomplete.asp
    function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("keyup", function (e) {
        if (e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38) { // not Enter,Up,Down arrow
            var a, b, i, val = this.value;

            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;

            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");

            this.parentNode.appendChild(a);

            for (i = 0; i < arr.length; i++) {
                if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                    b = document.createElement("DIV");

                    b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].name.substr(val.length);

                    b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";

                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        inp.focus();
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        }

    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {

            if (currentFocus > -1) {
                if (x) {
                    x[currentFocus].click();
                    e.preventDefault();
                }
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Thêm từ khóa tìm kiếm
/*function addTags(nameTag, link) {
    var new_tag = `<a href=` + link + `>` + nameTag + `</a>`;

    // Thêm <a> vừa tạo vào khung tìm kiếm
    var khung_tags = document.getElementsByClassName('tags')[0];
    khung_tags.innerHTML += new_tag;
}*/

// Thêm sản phẩm vào trang
function addProduct(p, ele, returnString) {
	promo = new Promo(p.promo.name, p.promo.value); // class Promo
	product = new Product(p.ma, p.name, p.img, p.price, p.star, p.rateCount, promo); // Class product

	return addToWeb(product, ele, returnString);
}

// Thêm topnav vào trang
function addTopNav() {
    document.write(`    
	<div class="top-nav group">
        <section>
            <div class="social-top-nav">
                <a href="#"><i class="fa-brands fa-facebook" style="color: #0091ff;"></i></a>
                <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="#"><i class="fab fa-google google-icon" style></i></a>
                <a href="#"><i class="fa-brands fa-youtube" style="color: #ff0000;"></i></a>
            </div> <!-- End Social Topnav -->

            <ul class="top-nav-quicklink flexContain">
                <li><a href="index.html"><i class="fa fa-home"></i> Trang chủ</a></li>
                <li><a href="gioithieu.html"><i class="fa fa-info-circle"></i> Giới thiệu</a></li>
                <li><a href="lienhe.html"><i class="fa fa-phone"></i> Liên hệ</a></li>
            </ul> <!-- End Quick link -->
        </section><!-- End Section -->
    </div>  <!-- End Top Nav  -->`);
}

// Thêm header
function addHeader() {
    document.write(`        
	<div class="header group">
        <div class="logo">
            <a href="index.html">
                <img src="img/logo.jpg" alt="Trang chủ Event Sponsor" title="Trang chủ Event Sponsor">
            </a>
        </div> <!-- End Logo -->

        <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form> <!-- End Form search -->
                <div class="tags">
                    <strong> </strong>
                </div>
            </div> <!-- End Search header -->

            <div class="tools-member">
                <div class="member">
                    <a onclick="checkTaiKhoan()">
                        <i class="fa fa-user"></i>
                        Tài khoản
                    </a>
                    <div class="menuMember hide">
                        <a href="nguoidung.html">Trang người dùng</a>
                        <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
                    </div>

                </div> <!-- End Member -->

                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa-solid fa-file-signature"></i>
                        <span>Xem các sự kiện tài trợ</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!--<div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Các sự kiện tài trợ</span>
                    </a>
                </div> -->
            </div><!-- End Tools Member -->
        </div> <!-- End Content -->
    </div> <!-- End Header -->`)
}
// Thêm footer
function addFooter() {
    document.write(`
    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <!-- ============== Footer ============= -->
<footer>
        <section>    
            <div id="containerFooter">
                <div class="copy-right">
                    <div>
                        <div>
                            <span>Hotline</span>
                        </div>
        
                        <div>
                            <span>1900.8888(Thứ 2-6)</span>
                        </div>       
        
                        <div>
                            <span>Email</span>
                        </div>
        
                        <div>
                            <span>support@enventsponsor.vn</span>
                        </div>
        
                        <div>
                            <span>Văn phòng</span>
                        </div>
        
                        <div>
                            <span>133 Nguyễn Văn Trỗi, Hà Đông, Hà Nội</span>
                        </div>
                    </div>
                </div>
        
                <div class="copy-right">
                    <div>
                        <div>
                            <span>Dành cho khách hàng</span>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Điều khoản sử dụng cho khách hàng
                            </a>
                        </div>
        
                        <div>
                            <span>Dành cho nhà tài trợ</span>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Điều khoản sử dụng cho nhà tài trợ
                            </a>
                        </div>
                    </div>
                </div>
        
                <div class="copy-right">
                    <div>
                        <div>
                            <span>Về chúng tôi</span>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Quy chế hoạt động
                            </a>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Chính sách bảo mật thông tin               
                            </a>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Cơ chế giải quyết khiếu nại/tranh chấp
                            </a>
                        </div>
        
                        <div style="text-decoration: underline;">
                            <a href="ĐIỀU KHOẢN SỬ DỤNG ÁP DỤNG CHO KHÁCH HÀNG.pdf"  >
                                Giới thiệu về trang web
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </footer>`);
}

// Thêm contain Taikhoan
function addContainTaiKhoan() {
    document.write(`
	<div class="containTaikhoan">
        <span class="close" onclick="showTaiKhoan(false);">&times;</span>
        <div class="taikhoan">

            <ul class="tab-group">
                <li class="tab active"><a href="#login">Đăng nhập</a></li>
                <li class="tab"><a href="#signup">Đăng kí</a></li>
            </ul> <!-- /tab group -->

            <div class="tab-content">
                <div id="login">

                    <form onsubmit="return logIn(this);">

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req"></span>
                            </label>
                            <input name='username' type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req"></span>
                            </label>
                            <input name="pass" type="password" required autocomplete="off" />
                        </div> <!-- pass -->

                        <p class="forgot"><a href="#">Quên mật khẩu?</a></p>

                        <button type="submit" class="button button-block" />Tiếp tục</button>

                    </form> <!-- /form -->

                </div> <!-- /log in -->

                <div id="signup">
                    <form onsubmit="return signUp(this);">

                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Họ<span class="req"></span>
                                </label>
                                <input name="ho" type="text" required autocomplete="off" />
                            </div>

                            <div class="field-wrap">
                                <label>
                                    Tên<span class="req"></span>
                                </label>
                                <input name="ten" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->

                        <div class="field-wrap">
                            <label>
                                Địa chỉ Email<span class="req"></span>
                            </label>
                            <input name="email" type="email" required autocomplete="off" />
                        </div> <!-- /email -->

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req"></span>
                            </label>
                            <input name="newUser" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req"></span>
                            </label>
                            <input name="newPass" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->

                        <button type="submit" class="button button-block" />Tạo tài khoản</button>

                    </form> <!-- /form -->

                </div> <!-- /sign up -->
            </div><!-- tab-content -->

        </div> <!-- /taikhoan -->
    </div>`);
}

