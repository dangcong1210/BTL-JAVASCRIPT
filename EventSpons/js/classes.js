function User(username, pass, ho, ten, email, products, donhang) {
	this.ho = ho || '';
	this.ten = ten || '';
	this.email = email || '';

	this.username = username;
	this.pass = pass;
	this.products = products || [];
	this.donhang = donhang || [];
}

function equalUser(u1, u2) {
	return (u1.username == u2.username && u1.pass == u2.pass);
}

function Promo(name, value) { // khuyen mai
	this.name = name; // giamGia, traGop, giaReOnline
	this.value = value;

	this.toWeb = function () {
		if (!this.name) return "";
		var contentLabel = "";
		switch (this.name) {
			case "giamgia":
				contentLabel = `<i class="fa fa-bolt"></i> Giảm ` + this.value + `&#8363;`;
				break;

			case "tragop":
				contentLabel = ` `;
				break;

			case "giareonline":
				contentLabel = ``;
				break;

			case "moiramat":
				contentLabel = "";
				break;
		}

		var label =
			`<label class=` + this.name + `>
			` + contentLabel + `
		</label>`;

		return label;
	}
}

function Product(ma, name, img, price, star, rateCount, promo) {
	this.ma = ma;
	this.img = img;
	this.name = name;
	this.rateCount = rateCount;
	this.promo = promo;
}

function addToWeb(p, ele, returnString) {
	// Chuyển star sang dạng tag html
	var rating = "";
	
	// Chuyển giá tiền sang dạng tag html
	var price = `<strong>` + p.price + `&#8363;</strong>`;
	if (p.promo && p.promo.name == "giareonline") {
		// khuyến mãi 'Giá rẻ online' sẽ có giá thành mới
		price = `<strong>` + p.promo.value + `&#8363;</strong>
				<span>` + p.price + `&#8363;</span>`;
	}

	// Tạo link tới chi tiết sản phẩm, chuyển tất cả ' ' thành '-'
	var chitietSp = 'chitietsanpham.html?' + p.name.split(' ').join('/');

	// Cho mọi thứ vào tag <li>... </li>
	var newLi =
	`<li class="sanPham">
		<a href="` + chitietSp + `">
			<img src=` + p.img + ` alt="">
			<h3>` + p.name + `</h3>
			
			` + (p.promo && p.promo.toWeb()) + `
			<div class="tooltip">
				<button class="themvaogio" onclick="themVaoGioHang('`+p.ma+`', '`+p.name+`'); return false;">
					<span class="tooltiptext" style="font-size: 15px;">Thêm vào sự kiện tài trợ</span>
					+
				</button>
			</div>
		</a>
	</li>`;

	if(returnString) return newLi;

	// Thêm tag <li> vừa tạo vào <ul> homeproduct (mặc định) , hoặc tag ele truyền vào
	var products = ele || document.getElementById('products');
	products.innerHTML += newLi;
}