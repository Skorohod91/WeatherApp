const mainUrl = 'https://api.openweathermap.org/data/2.5/'
const weatherAPi = 'weather'
const oneCallApi = 'onecall'
const apiKey = '88fd65229c4950c9b85ec14553ef7cae'

function getSummaryTemplate(data) {
  return `
  <div class="weather-summary">
      <div class="weather-summary-item">
          <h1 class="city-name">${data.name}</h1>
          <div class="current-time">${data.time}</div>
      </div>
      <div class="weather-summary-item">
          <div class="temperature-container">
              <span class="temperature">${data.temperature}</span>
              <button class="btn btn-link btn-color-red btn-celsius active">°C</button> 
              | 
              <button class="btn btn-link btn-color-red btn-fahrenheit">°F</button>
          </div>
          <div class="current-wether-container">
              <span class="current-wether-title">Currently:</span>
              <img class="current-weather-imgclear" src="https://openweathermap.org/img/wn/${data.icon}.png" alt="clear">
          </div>
      </div>
  </div>`
}

function getForecastTemplate(data) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu","Fri", "Sat"];

  return `
    <div class="col-2">
      <div class="weather-forecast-date">${days[data.day]}</div> 
        <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="" width="42"/>
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> 
            ${Math.round(data.max)}°C/
          </span>
          <span class="weather-forecast-temperature-min">
            ${Math.round(data.min)}°C
          </span>
      </div> 
    </div>
  `;
}

function makeRequest(data, api, callback) {
  let apiUrl
  if (data.coords) {
    const lat = data.coords.latitude
    const lon = data.coords.longitude
    apiUrl = `${mainUrl}${api}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  } else {
    apiUrl = `${mainUrl}${api}?q=${data.name}&units=metric&appid=${apiKey}`
  }
  
  axios.get(apiUrl).then(callback)
}

function searchByCoords(position) {
  makeRequest({coords: position.coords}, weatherAPi, updateView)
}

function searchByName() {
  const inputField = document.querySelector(".input-field")

  if (inputField.value !== "") {
    makeRequest({name: inputField.value}, weatherAPi, updateView)
  }
}

function getForecastData(data) {
  makeRequest(data, oneCallApi, displayForecast)
}

function tempToFahr(temp) {
  return Math.floor(temp*1.8+32)
}

function getDate(timestamp) {
  return new Date(timestamp * 1000).getDay()
}

function displayForecast({data}) {
  const forecastElement = document.querySelector("#forecast")
  forecastElement.innerHTML = ''
  data.daily.shift()
  data.daily.pop()
  data = data.daily.map(item => {
    return {
      day: getDate(item.dt),
      min: item.temp.min,
      max: item.temp.max,
      icon: item.weather[0].icon
    }
  })

  data.forEach((day) => {
    forecastElement.innerHTML += getForecastTemplate(day)
  })
}

function initAdditionalListeners(data) {
  const buttonCelsius = document.querySelector(".btn-celsius")
  const buttonFahrenheit = document.querySelector(".btn-fahrenheit")
  const currentTemp = document.querySelector(".temperature")

  buttonCelsius.addEventListener("click", () => {
    currentTemp.innerHTML = data.temperature
  })


  buttonFahrenheit.addEventListener("click", () => {
    currentTemp.innerHTML = tempToFahr(data.temperature)
  })
}

function setCurrentDateAndTime() {
  const currentDate = new Date()
  const days = ["Monday", "Thuesady", "Wednsday", "Thersday", "Friday", "Sanday", "Saturday"]
  const day = days[currentDate.getDay() - 1]
  const hours = currentDate.getHours()
  const minutes = String(currentDate.getMinutes()).length === 1 ? "0" + currentDate.getMinutes() : currentDate.getMinutes() 
  const dateElement = document.querySelector(".current-time")
  dateElement.innerHTML = day + " " + hours + ":" + minutes
}

function updateView(res) {
  const summaryPlaceholder = document.querySelector('.container-summary')
  const data = {}
  data.temperature = Math.round(res.data.main.temp)
  data.name = res.data.name
  data.icon = res.data.weather[0].icon
  data.coords = {
    latitude: res.data.coord.lat,
    longitude: res.data.coord.lon
  }

  summaryPlaceholder.innerHTML = getSummaryTemplate(data)

  initAdditionalListeners(data)
  setCurrentDateAndTime()
  getForecastData(data)
}

function initApp() {
  const searchButton = document.querySelector(".btn-success")
  const buttonPosition = document.querySelector('.btn-position')
  const form = document.querySelector("form")

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    searchByName()
  })

  searchButton.addEventListener("click", () => {
    searchByName()
  })

  buttonPosition.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(searchByCoords)
  })
}

initApp()