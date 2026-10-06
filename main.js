const API = 'https://6aaed43f606bd915d111128b.mockapi.io/api/products';

let page = 1;
let limit = 5;
let totalPages = 0;

const pagContainer = document.getElementById('pages');
const productsContainer = document.getElementById('products');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('HTTP Error');
	}
	return response.json();
}

async function getAllProducts() {
	try {
		const data = await fetchJson(API);
		totalPages = Math.ceil(data.length / limit);
		renderPagination();
	} catch (error) {
		console.error(error);
	}
}

function renderPagination() {
	pagContainer.innerHTML = '';
	Array.from({ length: totalPages }).forEach((_, idx) => {
		pagContainer.insertAdjacentHTML(
			'beforeend',
			`<button data-page="${idx + 1}">${idx + 1}</button>`,
		);
	});

	setActivePage();
}

async function fetchProducts() {
	try {
		const data = await fetchJson(`${API}?page=${page}&limit=${limit}`);
		renderProducts(data);
	} catch (error) {
		console.error(error);
	}
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

function setActivePage() {
	pagContainer.querySelectorAll('button').forEach(btn => {
		btn.classList.toggle('active', Number(btn.dataset.page) === page);
	});
}

pagContainer.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;

	if (target.tagName !== 'BUTTON') {
		return;
	}

	page = Number(target.dataset.page);
	setActivePage();
	fetchProducts();
});

prevBtn.addEventListener('click', () => {
	if (page > 1) {
		page--;
		setActivePage();
		fetchProducts();
	}
});

nextBtn.addEventListener('click', () => {
	if (page < totalPages) {
		page++;
		setActivePage();
		fetchProducts();
	}
});

async function init() {
	await Promise.all([getAllProducts(), fetchProducts()]);
}

init();
