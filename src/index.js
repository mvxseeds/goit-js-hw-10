import './css/styles.css';
import debounce from 'lodash.debounce';
import FetchCountriesApi from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
	input: document.querySelector('input#search-box'),
	list: document.querySelector('.country-list'),
	info: document.querySelector('.country-info'),
}

// class instance
const fetchCountriesApi = new FetchCountriesApi();


refs.input.addEventListener('keydown', debounce(onUserInput, DEBOUNCE_DELAY));

let query = '';

function onUserInput(e) {
	query = e.target.value.trim();
	
	if (query) {
		fetchCountriesApi.query = query;
		// remove console.log after debug
		fetchCountriesApi.fetchCountryData().then(validateResponse).catch(error => console.log(error)/*Notify.failure("Oops, there is no country with that name"*/);
	} else {
		clearData();
	}
}

function validateResponse(data) {
	if (data.length >= 10) {
		Notify.info("Too many matches found. Please enter a more specific name.");
	} else {
		renderResponse(data);
	}
}

function renderResponse(data) {
	if (data.length === 1) {
		// pass 1st (single) element of the collection
		const countryMarkup = markupSingleCountryData(data[0]);
		clearData();
		refs.info.insertAdjacentHTML('beforeend', countryMarkup);
	} else {
		// refactor duplicating code
		const countriesCollectionMarkup = data.map(listElementCountryMarkup).join('');
		clearData();
		refs.info.insertAdjacentHTML('beforeend', countriesCollectionMarkup);
	}
}


function markupSingleCountryData({ name, capital, population, flags, languages }) {
	const langs = Object.values(languages).map(lang => lang).join(", ");
	
	// add css/sass styles + inline svg
	return `
		<div class="country">
			<img src = "${flags.svg}" alt="Country Flag"/ class="country__flag" width="40" height="40">
			<h1 class="country__name">${name.official}</h1>
		</div>
		<p><span class="term">Capital: </span>${capital}</p>
		<p><span class="term">Population: </span>${capital}</p>
		<p><span class="term">Languages: </span>${langs}</p>
	`;
}


function listElementCountryMarkup({ name, flags }) {
	// add css/sass styles + inline svg
	return `
		<li class="country">
			<img src = "${flags.svg}" alt="Country Flag"/ class="country__flag" width="50" height="50">
			<p class="country__name">${name.official}</p>
		</li>
	`;
}


function clearData() {
	refs.info.innerHTML = "";
	refs.list.innerHTML = "";
}
