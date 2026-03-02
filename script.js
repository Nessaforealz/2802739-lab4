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
        // Update DOM,also display official name below common name
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Official Name:</strong> ${country.name.official}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        /* Fetch bordering countriesPart 5: API Response Structure

The REST Countries API returns data in this format:

[
    {
        "name": {
            "common": "South Africa",
            "official": "Republic of South Africa"
        },
        "capital": ["Pretoria"],
        "population": 59308690,
        "region": "Africa",
        "borders": ["BWA", "LSO", "MOZ", "NAM", "SWZ", "ZWE"],
        "flags": {
            "svg": "https://flagcdn.com/za.svg",
            "png": ""
        }
    }
]
When displaying the country,we put the common name above the official name i.e for South Africa we wqill display Republic of South Africa below South AfricaAn then we will have a common lin
To get bordering country details, fetch by country code: https://restcountries.com/v3.1/alpha/{code} */

/*all bordering countires shall be displayed with their country code instead of their name
and the bordering country flags are the same size 
 */
        if (country.borders) {      
            const borderCodes = country.borders.join(',');
            const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
            const borderData = await borderResponse.json();
            borderingCountries.innerHTML = '<h3>Bordering Countries:</h3>';
            borderData.forEach(borderCountry => {
                borderingCountries.innerHTML += `
                    <div class="border-country">
                        <p>${borderCountry.cca3}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            });
        } else {
            borderingCountries.innerHTML = '<p>No bordering countries.</p>';
        }
    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        loadingSpinner.style.display = 'none';
    }
}   