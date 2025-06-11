const locations = {
  sigula: { name: "Sigula", lat: 59.45, lon: 25.5167 },
  tallinn: { name: "Tallinn", lat: 59.437, lon: 24.7536 }
};

const weatherCodes = {
  0: "Selge", 1: "Peamiselt selge", 2: "Osaliselt pilves", 3: "Pilves",
  45: "Udu", 48: "Udune härmatis",
  51: "Nõrk uduvihm", 53: "Mõõdukas uduvihm", 55: "Tugev uduvihm",
  61: "Nõrk vihm", 63: "Mõõdukas vihm", 65: "Tugev vihm",
  71: "Nõrk lumesadu", 73: "Mõõdukas lumesadu", 75: "Tugev lumesadu",
  80: "Nõrgad hoovihmad", 81: "Mõõdukad hoovihmad", 82: "Tugevad hoovihmad",
  95: "Äikest", 96: "Äikest rahega", 99: "Tugev äike rahega"
};

function getIcon(code) {
  return `https://raw.githubusercontent.com/basmilius/weather-icons/master/production/fill/svg/${code}.svg`;
}

function fetchWeather(locationKey) {
  const loc = locations[locationKey];
  const now = new Date();
  const start = now.toISOString().split(":")[0] + ":00";
  const later = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().split(":")[0] + ":00";

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=temperature_2m,weathercode,windspeed_10m&timezone=Europe%2FTallinn&start_date=${start.slice(0, 10)}&end_date=${later.slice(0, 10)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const times = data.hourly.time;
      const temps = data.hourly.temperature_2m;
      const codes = data.hourly.weathercode;
      const winds = data.hourly.windspeed_10m;

      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      let nowHour = now.getHours();
      let count = 0;
      for (let i = 0; i < times.length; i++) {
        const time = new Date(times[i]);
        const hour = time.getHours();
        if ((hour - nowHour + 24) % 3 === 0 && hour >= nowHour && count < 3) {
          const code = codes[i];
          const div = document.createElement("div");
          div.className = "forecast-block";
          div.innerHTML = `
            <strong>${hour}:00</strong><br>
            <img src="${getIcon(code)}" alt="icon" width="40" height="40"><br>
            ${Math.round(temps[i])}°C<br>
            💨 ${Math.round(winds[i])} m/s<br>
            <small>${weatherCodes[code] || "?"}</small>
          `;
          forecastContainer.appendChild(div);
          count++;
        }
      }

      document.getElementById("location").textContent = `Asukoht: ${loc.name}`;
    })
    .catch(err => {
      console.error("Ilma laadimine ebaõnnestus:", err);
    });
}

document.getElementById("locationSelect").addEventListener("change", (e) => {
  fetchWeather(e.target.value);
});

fetchWeather("sigula");
