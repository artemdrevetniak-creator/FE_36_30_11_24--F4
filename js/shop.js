export const products = [
	{
		id: 1,
		title: 'Laptop',
		price: 1200,
	},
	{
		id: 2,
		title: 'Keyboard',
		price: 100,
	},
	{
		id: 3,
		title: 'Headphones',
		price: 200,
	},
];

export function renderProducts(products, container) {
	container.innerHTML = products
		.map(
			product => `
                <article class="product">
                    <h2>${product.title}</h2>

                    <p>$${product.price}</p>

                    <button
                        type="button"
                        data-buy="${product.id}"
                    >
                        Buy
                    </button>
                </article>
            `,
		)
		.join('');
}

export function findProduct(productId) {
	return products.find(product => product.id === productId);
}
