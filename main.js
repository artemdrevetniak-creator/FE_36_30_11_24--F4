const API = 'https://6aaed43f606bd915d111128b.mockapi.io/api/products';

let page = 1;
let limit = 5;
let totalPages = 0;

const pagContainer = document.getElementById('pages');
const productsContainer = document.getElementById('products');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function getAllProducts() {
	fetch(API)
		.then(response => {
			return response.json();
		})
		.then(data => {
			totalPages = Math.ceil(data.length / limit);
			renderPagination();
		});
}

function renderPagination() {
	Array.from({ length: totalPages }).forEach((_, idx) => {
		pagContainer.insertAdjacentHTML(
			'beforeend',
			`<button data-page="${idx + 1}">${idx + 1}</button>`,
		);
	});

	const allPag = pagContainer.querySelectorAll('button');
	const activePag = Object.values(allPag).find(
		pag => Number(pag.dataset.page) === page,
	);

	activePag.classList.add('active');
}

function fetchProducts() {
	fetch(`${API}?page=${page}&limit=${limit}`)
		.then(response => {
			return response.json();
		})
		.then(data => renderProducts(data));
}

function renderProducts(data) {
	productsContainer.innerHTML = '';
	data.forEach(el => {
		productsContainer.insertAdjacentHTML(
			'beforeend',
			`<article class='product-card'>
				<div class='product-card__content'>
					<h3 class='product-card__name'>
						${el.name}
					</h3>
					<p class='product-card__material'>
						Material: ${el.material}
					</p>
					<p class='product-card__description'>
						${el.description}
					</p>
				</div>
			</article>`,
		);
	});
}

pagContainer.addEventListener('click', event => {
	event.preventDefault();

	const target = event.target;
	if (target.tagName !== 'BUTTON') {
		return;
	}
	page = Number(target.dataset.page);

	const allPag = pagContainer.querySelectorAll('button');
	allPag.forEach(pag => pag.classList.remove('active'));

	const activePag = Object.values(allPag).find(
		pag => Number(pag.dataset.page) === page,
	);

	activePag.classList.add('active');

	fetchProducts();
});

prevBtn.addEventListener('click', () => {
	if (page > 1) {
		page--;

		const allPag = pagContainer.querySelectorAll('button');
		allPag.forEach(pag => pag.classList.remove('active'));

		const activePag = Object.values(allPag).find(
			pag => Number(pag.dataset.page) === page,
		);

		activePag.classList.add('active');

		fetchProducts();
	}
});

nextBtn.addEventListener('click', () => {
	if (page < totalPages) {
		page++;

		const allPag = pagContainer.querySelectorAll('button');
		allPag.forEach(pag => pag.classList.remove('active'));

		const activePag = Object.values(allPag).find(
			pag => Number(pag.dataset.page) === page,
		);

		activePag.classList.add('active');

		fetchProducts();
	}
});

fetchProducts();
getAllProducts();
