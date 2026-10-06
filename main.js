const API = 'https://6aaed43f606bd915d111128b.mockapi.io/api';

let page = 1;
let limit = 5;
let totalPages = 0;

const pagContainer = document.getElementById('pages');
const usersContainer = document.getElementById('users');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error('HTTP Error');
	}
	return response.json();
}

async function getAllUsers() {
	try {
		const data = await fetchJson(`${API}/users`);
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

async function fetchUsers() {
	try {
		const data = await fetchJson(`${API}/users?page=${page}&limit=${limit}`);
		renderUsers(data);
	} catch (error) {
		console.error(error);
	}
}

async function fetchUserTasks(id) {
	try {
		const data = await fetchJson(`${API}/users/${id}/tasks?completed=true`);
		return data;
	} catch (error) {
		console.error(error);
	}
}

function renderUsers(users) {
	usersContainer.innerHTML = '';
	users.forEach(async user => {
		const userTasks = await fetchUserTasks(user.id);
		console.log(user.id, userTasks);

		const completedTasks = userTasks.filter(task => task.completed === true);

		usersContainer.insertAdjacentHTML(
			'beforeend',
			`<article class='product-card'>
				<div class='product-card__content'>
					<div>
						<h3 class='product-card__name'>
							${user.name}
						</h3>
						<p class='product-card__material'>
							Age: ${user.age}
						</p>
						<p class='product-card__description'>
							${user.email}
						</p>
					</div>
					<button class='product-card__btn' data-user='${user.id}'>View Tasks</button>
				</div>
				<div class='product-card__tasks' id='tasks'>
					${completedTasks.length} completed tasks 
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
	fetchUsers();
});

prevBtn.addEventListener('click', () => {
	if (page > 1) {
		page--;
		setActivePage();
		fetchUsers();
	}
});

nextBtn.addEventListener('click', () => {
	if (page < totalPages) {
		page++;
		setActivePage();
		fetchUsers();
	}
});

async function init() {
	await Promise.all([getAllUsers(), fetchUsers()]);
}

init();
