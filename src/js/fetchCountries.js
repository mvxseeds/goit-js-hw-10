export default class CountriesAPI {
	constructor() {
		this.userQuery = '';
	}
	
	fetchCountryData() {
		const url = `https://restcountries.com/v3.1/name/${this.userQuery}?fields=name,capital,population,flags,languages`;
		
		return fetch(url)
			.then(response => {
				if (response.ok) { 
					return response.json();
				} else {
					throw 404;
					console.log(response);
				}
			}
		);
	}
	
	get query() {
		return this.userQuery;
	}
	
	set query(newQuery) {
		this.userQuery = newQuery;
	}
}