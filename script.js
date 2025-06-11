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

function fetchWeather(locationKey) {
  const loc = locations[locationKey];
  const now = new Date();
  const start = now.toISOString().split(":")[0] + ":00";
  const later = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().split(":")[0] + ":00";

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=temperature_2m,weathercode&timezone=Europe%2FTallinn&start_date=${start.slice(0, 10)}&end_date=${later.slice(0, 10)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const times = data.hourly.time;
      const temps = data.hourly.temperature_2m;
      const codes = data.hourly.weathercode;

      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      let nowHour = now.getHours();
      for (let i = 0; i < times.length; i++) {
        const hour = new Date(times[i]).getHours();
        if ((hour - nowHour + 24) % 3 === 0 && hour >= nowHour && forecastContainer.children.length < 3) {
          const div = document.createElement("div");
          div.className = "forecast-block";
          div.innerHTML = `<strong>${hour}:00</strong><br>${Math.round(temps[i])}°C<br>${weatherCodes[codes[i]] || "?"}`;
          forecastContainer.appendChild(div);
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

// Lae vaikimisi Sigula ilm
fetchWeather("sigula");
