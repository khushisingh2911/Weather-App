document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'd2ea83991dmsh4226e3298d74e55p15b5fcjsndd5e5cec0336'; // Replace with your actual API key
    const weatherContainer = document.getElementById('weather-container');
    const cityInput = document.getElementById('city-input');
    const getWeatherButton = document.getElementById('get-weather');

    // Function to show weather containers
    function showWeatherContainers() {
        const containers = document.querySelectorAll('.data-container');
        containers.forEach(container => container.style.display = 'block');
    }

    // Function to display error messages
    function displayError(message) {
        const errorContainer = document.querySelector('#error-container');
        errorContainer.textContent = message;
    }

    // Function to update and display the date and time
    function updateDateTime() {
        const now = moment();
        const dateDisplay = document.getElementById('current-date');
        const timeDisplay = document.getElementById('current-time');
        dateDisplay.textContent = now.format('dddd, DD MMM');
        timeDisplay.textContent = now.format('hh:mm:ss A');
    }

    // Update the date and time every second
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Try to fetch weather by user's location on load
    fetchWeatherByLocation();

    // Fetch weather data when the 'Get Weather' button is clicked
    getWeatherButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            fetchWeatherByLocation();
        }
    });

    // Function to fetch weather data by geolocation
    function fetchWeatherByLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                getWeatherData(`lat=${latitude}&lon=${longitude}`);
            }, () => {
                displayError('Location access denied.');
            });
        } else {
            displayError('Geolocation is not supported by this browser.');
        }
    }

    // Function to fetch weather data by city name
    function fetchWeather(city) {
        getWeatherData(`city=${encodeURIComponent(city)}`);
    }

    // Function to get weather data from the API
    function getWeatherData(query) {
        const apiUrl = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?${query}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
            }
        };

        fetch(apiUrl, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API request failed with status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
                showWeatherContainers();
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                displayError(`Error fetching weather data: ${error.message}`);
            });
    }

    // Function to display the weather data
    function displayWeather(data) {
        const city = data.city || 'your location';
        document.getElementById('weather-city').textContent = `Weather in ${city}`;
        document.getElementById('temperature').textContent = `${data.temp} °C`;
        document.getElementById('feels-like').textContent = `${data.feels_like} °C`;
        document.getElementById('humidity').textContent = `${data.humidity}%`;
        document.getElementById('wind-speed').textContent = `${data.wind_speed} m/s`;
        document.getElementById('wind-direction').textContent = `${data.wind_degrees} degrees`;
        document.getElementById('cloudiness').textContent = `${data.cloud_pct}%`;
        document.getElementById('sunrise').textContent = moment.unix(data.sunrise).format('hh:mm a');
        document.getElementById('sunset').textContent = moment.unix(data.sunset).format('hh:mm a');
    }
});
