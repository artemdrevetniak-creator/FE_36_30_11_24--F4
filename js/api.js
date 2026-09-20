export function checkProduct(productId) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const success = Math.random() > 0.1;

			if (success) {
				resolve({
					productId,
					message: 'Product is available',
				});
			} else {
				reject('Product is unavailable');
			}
		}, 1500);
	});
}

export function checkBalance(price) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const balance = 1500;

			if (balance >= price) {
				resolve({
					balance,
					message: 'Balance is sufficient',
				});
			} else {
				reject('Not enough money');
			}
		}, 1500);
	});
}

export function processPayment(price) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const success = Math.random() > 0.15;

			if (success) {
				resolve({
					transactionId: Math.floor(Math.random() * 100000),
					amount: price,
					message: 'Payment successful',
				});
			} else {
				reject('Payment failed');
			}
		}, 2000);
	});
}

export function createOrder(product, payment) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({
				id: Math.floor(Math.random() * 100000),
				product: product.title,
				price: product.price,
				transactionId: payment.transactionId,
				status: 'Completed',
			});
		}, 1500);
	});
}

export function calculateDelivery() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const success = Math.random() > 0.1;

			if (success) {
				const deliveryPrice = 15;

				resolve({
					price: deliveryPrice,
					message: 'Delivery calculated',
				});
			} else {
				reject('Delivery service unavailable');
			}
		}, 1500);
	});
}
