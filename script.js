const locations = {
  sigula: { name: "Sigula", lat: 59.45, lon: 25.5167 },
  tallinn: { name: "Tallinn", lat: 59.437, lon: 24.7536 }
};

const weatherCodes = {
  0: "Selge",
  1: "Peamiselt selge",
  2: "Osaliselt pilves",
  3: "Pilves",
  45: "Udu",
  48: "Udune härmatis",
  51: "Nõrk uduvihm",
  53: "Mõõdukas uduvihm",
  55: "Tugev uduvihm",
  61: "Nõrk vihm",
  63: "Mõõdukas vihm",
  65: "Tugev vihm",
  71: "Nõrk lumesadu",
  73: "Mõõdukas lumesadu",
  75: "Tugev lumesadu",
  80: "Nõrgad hoovihmad",
  81: "Mõõdukad hoovihmad",
  82: "Tugevad hoovihmad",
  95: "Äikest",
  96: "Äikest rahega",
  99: "Tugev äike rahega"
};

function fetchWeather(locationKey) {
  const loc = locations[locationKey];
  const today = new Date().toISOString().split("T")[0];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FTallinn`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const dayIndex = data.daily.time.indexOf(today);
      if (dayIndex === -1) throw new Error("Tänase ilmaandmeid ei leitud.");

      const tMin = data.daily.temperature_2m_min[dayIndex];
      const tMax = data.daily.temperature_2m_max[dayIndex];
      const code = data.daily.weathercode[dayIndex];

      document.getElementById("location").textContent = `Asukoht: ${loc.name}`;
      document.getElementById("temp").textContent = `Temperatuur: ${Math.round(tMin)}°C kuni ${Math.round(tMax)}°C`;
      document.getElementById("desc").textContent = `Ilmatüüp: ${weatherCodes[code] || "Tundmatu"}`;
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
