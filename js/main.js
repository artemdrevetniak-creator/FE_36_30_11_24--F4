import { products, renderProducts, findProduct } from './shop.js';

import {
	checkProduct,
	checkBalance,
	processPayment,
	createOrder,
	calculateDelivery,
} from './api.js';

const productsContainer = document.querySelector('[data-products]');
const status = document.querySelector('[data-status]');
const ordersContainer = document.querySelector('[data-orders]');

const orders = [];

renderProducts(products, productsContainer);

function renderOrders() {
	if (orders.length === 0) {
		ordersContainer.innerHTML = '<p>No orders yet.</p>';
		return;
	}

	ordersContainer.innerHTML = orders
		.map(
			order => `
                <article class="order">
                    <h3>Order #${order.id}</h3>

                    <p>Product: ${order.product}</p>

                    <p>Price: $${order.price}</p>

                    <p>Delivery: $${order.delivery}</p>

                    <p>Total: $${order.total}</p>

                    <p>Status: ${order.status}</p>
                </article>
            `,
		)
		.join('');
}

productsContainer.addEventListener('click', event => {
	const button = event.target.closest('[data-buy]');

	if (!button) {
		return;
	}

	const productId = Number(button.dataset.buy);

	const product = findProduct(productId);

	if (!product) {
		return;
	}

	button.disabled = true;

	status.textContent = '⏳ Checking product...';

	checkProduct(product.id)
		.then(result => {
			status.textContent = `✓ ${result.message}`;

			return checkBalance(product.price);
		})

		.then(result => {
			status.textContent = `✓ ${result.message}`;

			return processPayment(product.price);
		})

		.then(payment => {
			status.textContent = `✓ ${payment.message}. Transaction #${payment.transactionId}`;

			return createOrder(product, payment);
		})

		.then(order => {
			status.textContent = '⏳ Calculating delivery...';

			return calculateDelivery().then(delivery => {
				return {
					...order,
					delivery: delivery.price,
					total: order.price + delivery.price,
				};
			});
		})

		.then(order => {
			orders.push(order);

			renderOrders();

			status.textContent = `✓ Order #${order.id} created successfully!`;
		})

		.catch(error => {
			status.textContent = `✕ ${error}`;
		})

		.finally(() => {
			button.disabled = false;
		});
});

renderOrders();
