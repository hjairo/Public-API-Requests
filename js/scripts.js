// Global variables
let gallery = document.getElementById('gallery');
let body = document.querySelector('body');
let employeeIndex;
let cards = [];
let modals = [];

// Fetch function that processes API data. the data's status is checked to make sure the response has the requested data. If so, the response gets processed to json, which is then processed by the Card & Modal generator functions.
let checkStatus = (response) => {
	if (response.ok) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	};
};

let fetchData = (url) => {
	return fetch(url)
		.then(checkStatus)
		.then(res => res.json())
		.catch(error => console.log('Looks like there was a problem!', error));
};
const dataFetched = fetchData('https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,phone,dob');
dataFetched
	.then(data => generateCards(data));

dataFetched
	.then(data => generateModal(data));


// Employee card generator. Takes the data from the fetch function and generates the cards with the appropriate information.
let generateCards = (data) => {
	let i = 0;
	let employees = data.results;
	employees.map(person => {
		const card = `
			<div class="card" data-index="${i}">
				<div class="card-img-container">
	                <img class="card-img" src="${person.picture.large}" alt="profile picture">
	            </div>
	            <div class="card-info-container">
	                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
	                <p class="card-text">${person.email}</p>
	                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
	            </div>
	        </div>`;
	    i++;
		cards.push(card);
	});
	cards.forEach(container => {
		gallery.innerHTML += container;
	});
}

// Eventlistener for employee card to generate modal for employee. Matches the click request from a card with the appropriate modal for that employee. Also closes the modal whenever the close button is clicked.
let employeeModal = (event) => {
	selectedEmployee = event.target.closest('.card')
	if(selectedEmployee) {
		employeeIndex = selectedEmployee.getAttribute('data-index');
		body.innerHTML += modals[employeeIndex];
	};
	let closeButton = document.getElementById('modal-close-btn');
	if (document.querySelector('.modal-container') && closeButton.contains(event.target)) {
		document.querySelector('.modal-container').remove();	
	};
};

// Modal generator for each employee. Takes information from the fetch function and generates modals with the appropriate information.
let generateModal = (data) => {
	let employees = data.results;
	employees.forEach(person => {
	let birthday = person.dob.date.substring(0,10);
	birthday = birthday.split('-')[1] + '/' + birthday.split('-')[2] + '/' + birthday.split('-')[0];
	const modal = `
		<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${person.phone}</p>
                    <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday}</p>
                </div>
            </div>`;	
	modals.push(modal);
	});
};

// Event listener that calls the employeeModal function to listen for click events on the cards.
body.addEventListener('click', employeeModal);