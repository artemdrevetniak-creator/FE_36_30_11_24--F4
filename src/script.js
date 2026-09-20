import userTemplate from '../partials/user.hbs';

const API_URL = 'https://6aaed43f606bd915d111128b.mockapi.io/api/users';
// Підставляйте влачне посилання на mockapi

const usersList = document.querySelector('#usersList');
const userForm = document.querySelector('#userForm');

function getUsers() {
	fetch(API_URL)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.then(users => {
			renderUsers(users);
		})
		.catch(error => {
			console.error(error);
			showError('Не вдалося завантажити користувачів.');
		});
}

function renderUsers(users) {
	usersList.innerHTML = '';

	users.forEach(user => {
		const html = userTemplate(user);
		usersList.insertAdjacentHTML('beforeend', html);
	});
}

userForm.addEventListener('submit', event => {
	event.preventDefault();

	const data = new FormData(userForm);
	const userData = Object.fromEntries(data);

	createUser(userData);
});

function createUser(user) {
	fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('Created user:', data);
			userForm.reset();
			getUsers();
		})

		.catch(error => {
			console.error(error);
			showError('Не вдалося створити користувача.');
		});
}

usersList.addEventListener('click', event => {
	const e = event.target;

	if (!e.classList.contains('delete-user')) {
		return;
	}
	const userId = e.dataset.id;
	deleteUser(userId);
});

function deleteUser(userId) {
	const confirmed = confirm('Ви впевнені, що хочете видалити користувача?');

	if (!confirmed) {
		return;
	}

	fetch(`${API_URL}/${userId}`, {
		method: 'DELETE',
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
		})
		.then(() => getUsers())
		.catch(error => console.error(error));
}

getUsers();
