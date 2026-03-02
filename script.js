/*
Your script.js must implement:
1. API Fetching

Use the REST Countries API: https://restcountries.com/v3.1/name/{country}

// Example API call
const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
const data = await response.json();

2. Required Functionality

    Search trigger: Click button OR press Enter in input
    Loading state: Show spinner while fetching, hide when done
    Display country info:
        Country name
        Capital city
        Population (formatted with commas)
        Region
        Flag image
    Display bordering countries: Name and flag for each neighbor
    Error handling: Show user-friendly error messages

3. DOM Update Pattern

// Example DOM updates
document.getElementById('country-info').innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag">
`;

4. Code Structure

// Required: Use async/await OR .then() for API calls
// Required: Use try/catch OR .catch() for error handling

async function searchCountry(countryName) {
    try {
        // Show loading spinner
        // Fetch country data
        // Update DOM
        // Fetch bordering countries
        // Update bordering countries section
    } catch (error) {
        // Show error message
    } finally {
        // Hide loading spinner
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
}); */

const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', () => {
    const countryName = countryInput.value.trim();
    if (countryName) {
        searchCountry(countryName);
    }
});

countryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const countryName = countryInput.value.trim();
        if (countryName) {
            searchCountry(countryName);
        }
    }
});

async function searchCountry(countryName) {
    try {
        // Show loading spinner                             
        loadingSpinner.style.display = 'block';
        errorMessage.textContent = '';
        countryInfo.innerHTML = '';
        borderingCountries.innerHTML = '';          
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found');
        }
        const data = await response.json();
        const country = data[0];
        // Update DOM
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        // Fetch bordering countries
        if (country.borders) {
            const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`);
            const borderData = await borderResponse.json();
            borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
            borderData.forEach(borderCountry => {
                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" class="border-flag">
                        <p>${borderCountry.name.common}</p>
                    </div>
                `;
            });
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries.</p>';
        }
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
}              