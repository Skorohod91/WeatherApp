
const currentDate = new Date()
const days = ["Monday", "Thuesady", "Wednsday", "Thersday", "Friday", "Sanday", "Saturday"]
const dateElement = document.querySelector(".current-time")
const day = days[currentDate.getDay() - 1]
const hours = currentDate.getHours()
const minutes = String(currentDate.getMinutes()).length === 1 ? "0" + currentDate.getMinutes() : currentDate.getMinutes() 
const inputField = document.querySelector(".input-field")
const cityName = document.querySelector(".city-name")
const searchButton = document.querySelector(".btn-success")
const buttonCelsius = document.querySelector(".btn-celsius")
const buttonFahrenheit = document.querySelector(".btn-fahrenheit")
const currentTemp = document.querySelector(".temperature")
const buttonPosition = document.querySelector('.btn-position')
const apiKey = "88fd65229c4950c9b85ec14553ef7cae";
const tempCelsius = 17

dateElement.innerHTML = day + " " + hours + ":" + minutes

searchButton.addEventListener("click", () => {
  if (inputField.value !== "") {
    getTempByName(inputField.value)
  }
})

buttonCelsius.addEventListener("click", () => {
  currentTemp.innerHTML = tempCelsius
})

buttonFahrenheit.addEventListener("click", () => {
  currentTemp.innerHTML = tempToFahr(tempCelsius)
})

buttonPosition.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(myHomePosition)
})

function tempToFahr(temp) {
  return Math.floor(temp*1.8+32)
}

function myHomePosition(position) {
  const lat = position.coords.latitude
  const lon = position.coords.longitude
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  axios.get(apiUrl).then(updateView)
}

function getTempByName(name) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${apiKey}`
  axios.get(apiUrl).then(updateView)
}

function updateView(res) {
  console.log(res)
  currentTemp.innerHTML = Math.round(res.data.main.temp)
  cityName.innerHTML = res.data.name;
}
