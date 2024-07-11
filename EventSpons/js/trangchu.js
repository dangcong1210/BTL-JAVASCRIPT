window.onload = function () {
	khoiTao();

	// Thêm hình vào banner
	var numBanner = 4; // Số lượng hình banner
	for (var i = 1; i <= numBanner; i++) {
		var linkimg = "img/banners/banner" + i + ".png";
		addBanner(linkimg, linkimg);
	}

	// Khởi động thư viện hỗ trợ banner - chỉ chạy khi đã tạo hình trong banner
	var owl = $('.owl-carousel');
	owl.owlCarousel({
		items: 1.5,
		margin: 100,
		center: true,
		loop: true,
		smartSpeed: 450,
		autoplay: true,
		autoplayTimeout: 3500
	});

	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// Thêm sản phẩm vào trang
	var sanPhamPhanTich
	var sanPhamPhanTrang;

	var filters = getFilterFromURL();
	if (filters.length) { // có filter
		sanPhamPhanTich = phanTich_URL(filters, true);
		sanPhamPhanTrang = tinhToanPhanTrang(sanPhamPhanTich, filtersFromUrl.page || 1);
		if (!sanPhamPhanTrang.length) alertNotHaveProduct(false);
		else addProductsFrom(sanPhamPhanTrang);

		// hiển thị list sản phẩm
		document.getElementsByClassName('contain-products')[0].style.display = '';

	} else { // ko có filter : trang chính mặc định sẽ hiển thị các sp hot, ...
		var soLuong = (window.innerWidth < 1200 ? 4 : 5); // màn hình nhỏ thì hiển thị 4 sp, to thì hiển thị 5

		// Các màu
		var yellow_red = ['#ff9c00', '#ec1f1f'];
		var blue = ['#42bcf4', '#004c70'];
		var green = ['#5de272', '#007012'];

		// Thêm các khung sản phẩm
		var div = document.getElementsByClassName('contain-khungSanPham')[0];
		addKhungSanPham('SỰ KIỆN LÊN XU HƯỚNG', yellow_red, ['star=3', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('SỰ KIỆN MỚI', blue, ['promo=moiramat', 'sort=rateCount-decrease'], soLuong, div);
		addKhungSanPham('SỰ KIỆN NỔI BẬT ', green, ['promo=tragop', 'sort=rateCount-decrease'], soLuong, div);

	}

	addAllChoosedFilter();
};


var soLuongSanPhamMaxTrongMotTrang = 15;

// =========== Đọc dữ liệu từ url ============
var filtersFromUrl = { // Các bộ lọc tìm được trên url sẽ đc lưu vào đây
	company: '',
	search: '',
	// price: '',
	promo: '',
	// star: '',
	page: '',
	sort: {
		by: '',
		type: 'ascending'
	}
}

function getFilterFromURL() { // tách và trả về mảng bộ lọc trên url
	var fullLocation = window.location.href;
	fullLocation = decodeURIComponent(fullLocation);
	var dauHoi = fullLocation.split('?'); // tách theo dấu ?

	if (dauHoi[1]) {
		var dauVa = dauHoi[1].split('&');
		return dauVa;
	}

	return [];
}

function phanTich_URL(filters, saveFilter) {
	// var filters = getFilterFromURL();
	var result = copyObject(list_products);

	for (var i = 0; i < filters.length; i++) {
		var dauBang = filters[i].split('=');

		switch (dauBang[0]) {
			case 'search':
				dauBang[1] = dauBang[1].split('+').join(' ');
				result = timKiemTheoTen(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.search = dauBang[1];
				break;


			case 'company':
				result = timKiemTheoCongTySanXuat(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.company = dauBang[1];
				break;

			case 'promo':
				result = timKiemTheoKhuyenMai(result, dauBang[1]);
				if (saveFilter) filtersFromUrl.promo = dauBang[1];
				break;

			case 'page': // page luôn ở cuối đường link
				if (saveFilter) filtersFromUrl.page = dauBang[1];
				break;

			case 'sort':
				var s = dauBang[1].split('-');
				var tenThanhPhanCanSort = s[0];

				switch (tenThanhPhanCanSort) {

					case 'name':
						if (saveFilter) filtersFromUrl.sort.by = 'name';
						result.sort(function (a, b) {
							return a.name.localeCompare(b.name);
						});
						break;
				}

				if (s[1] == 'decrease') {
					if (saveFilter) filtersFromUrl.sort.type = 'decrease';
					result.reverse();
				}

				break;
		}
	}

	return result;
}

// thêm các sản phẩm từ biến mảng nào đó vào trang
function addProductsFrom(list, vitri, soluong) {
	var start = vitri || 0;
	var end = (soluong ? start + soluong : list.length);
	for (var i = start; i < end; i++) {
		addProduct(list[i]);
	}
}

function clearAllProducts() {
	document.getElementById('products').innerHTML = "";
}

// Thêm sản phẩm vào các khung sản phẩm
function addKhungSanPham(tenKhung, color, filter, len, ele) {
	// convert color to code
	var gradient = `background-image: linear-gradient(120deg, ` + color[0] + ` 0%, ` + color[1] + ` 50%, ` + color[0] + ` 100%);`
	var borderColor = `border-color: ` + color[0];
	var borderA = `	border-left: 2px solid ` + color[0] + `;
					border-right: 2px solid ` + color[0] + `;`;

	// mở tag
	var s = `<div class="khungSanPham" style="` + borderColor + `">
				<h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
				<div class="listSpTrongKhung flexContain">`;

	// thêm các <li> (sản phẩm) vào tag
	var spResult = phanTich_URL(filter, false);
	if (spResult.length < len) len = spResult.length;

	for (var i = 0; i < len; i++) {
		s += addProduct(spResult[i], null, true);
		// truyền vào 'true' để trả về chuỗi rồi gán vào s
	}

	// thêm khung vào contain-khung
	ele.innerHTML += s;
}


// Tính toán xem có bao nhiêu trang + trang hiện tại,
// Trả về mảng sản phẩm trong trang hiện tại tính được
function tinhToanPhanTrang(list, vitriTrang) {
	var sanPhamDu = list.length % soLuongSanPhamMaxTrongMotTrang;
	var soTrang = parseInt(list.length / soLuongSanPhamMaxTrongMotTrang) + (sanPhamDu ? 1 : 0);
	var trangHienTai = parseInt(vitriTrang < soTrang ? vitriTrang : soTrang);

	themNutPhanTrang(soTrang, trangHienTai);
	var start = soLuongSanPhamMaxTrongMotTrang * (trangHienTai - 1);

	var temp = copyObject(list);

	return temp.splice(start, soLuongSanPhamMaxTrongMotTrang);
}



function timKiemTheoKhuyenMai(list, tenKhuyenMai, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (list[i].promo.name == tenKhuyenMai) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}

function timKiemTheoRAM(list, luongRam, soluong) {
	var count, result = [];
	if (soluong < list.length) count = soluong;
	else count = list.length;

	for (var i = 0; i < list.length; i++) {
		if (parseInt(list[i].detail.ram) == luongRam) {
			result.push(list[i]);
			count--;
			if (count <= 0) break;
		}
	}

	return result;
}


// ========== Lọc TRONG TRANG ============
// Hiển thị Sản phẩm
function showLi(li) {
	li.style.opacity = 1;
	li.style.width = "239px";
	li.style.borderWidth = "1px";
}


// ================= Hàm khác ==================

// Thêm banner
function addBanner(img, link) {
	var newDiv = `<div class='item'>
						<a target='_blank' href=` + link + `>
							<img src=` + img + `>
						</a>
					</div>`;
	var banner = document.getElementsByClassName('owl-carousel')[0];
	banner.innerHTML += newDiv;
}





// Thêm chọn số lượng sao
function addStarFilter(value) {
	var link = createLinkFilter('add', 'star', value);

	var text = starToString(value);
	var star = `<a href="` + link + `">` + text + `</a>`;
	document.getElementsByClassName('starFilter')[0]
		.getElementsByClassName('dropdown-content')[0].innerHTML += star;
}

