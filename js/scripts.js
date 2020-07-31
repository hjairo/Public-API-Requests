const gallery = document.getElementById('gallery');

// Fetch Functions
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
		.catch(error => console.log('Looks like there was a problem!', error))
}

Promise.all([
	fetchData('https://randomuser.me/api/?results=12&?inc=picture,name,email,location,phone,dob')
])
.then(data => {
	let employees = data[0].results;
	let markup = ``;
	employees.forEach(employee => {
		markup += generateCards(employee);
	})
	gallery.innerHTML = markup;
})


// Generate markup for each employee card
let generateCards = (person) => {
	const card = `
		<div class="card">
			<div class="card-img-container">
                <img class="card-img" src="${person.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
        </div>
		`;
	return card;
}