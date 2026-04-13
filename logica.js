const cidades = [
    { nome: "São Paulo", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "London", timeZone: "Europe/London", gmt: "UTC+0" },
    { nome: "Brasília", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "New York", timeZone: "America/New_York", gmt: "UTC-5" },
    { nome: "Frankfurt", timeZone: "Europe/Berlin", gmt: "UTC+1" },
    { nome: "Manaus", timeZone: "America/Manaus", gmt: "UTC-4" },
    { nome: "Curitiba", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Moscow", timeZone: "Europe/Moscow", gmt: "UTC+3" },
    { nome: "Tokyo", timeZone: "Asia/Tokyo", gmt: "UTC+9" },
    { nome: "Sydney", timeZone: "Australia/Sydney", gmt: "UTC+10" }
];

function formatLocalTime(timeZone) {
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(new Date());
}

function renderCityTimes() {
    const html = [`<div class="time-card"><h3>Horários das principais cidades</h3><ul>`];
    cidades.forEach(cidade => {
        html.push(`
            <li><strong>${cidade.nome}</strong>: ${formatLocalTime(cidade.timeZone)} (${cidade.gmt})</li>
        `);
    });
    html.push(`</ul></div>`);
    document.getElementById("cityTimes").innerHTML = html.join("");
}

async function ResearchWeather() {
    const input = document.getElementById("locationInput").value.trim();

    if (!input) {
        alert("Digite o nome de uma cidade para pesquisar o clima.");
        return;
    }

    const queryLocation = input.replace(/\s*-\s*/g, ", ");
    const url = `https://wttr.in/${encodeURIComponent(queryLocation)}?format=j1`;

    
    document.getElementById("results").innerHTML = `<p>Buscando clima real para ${input}...</p>`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Cidade não encontrada ou serviço indisponível");
        }

        const data = await response.json();
        if (!data.current_condition || data.current_condition.length === 0) {
            throw new Error("Cidade não encontrada. Verifique o nome e tente novamente.");
        }
        const current = data.current_condition[0];
        if (!current.weatherDesc || !current.weatherDesc[0] || !current.weatherDesc[0].value) {
            throw new Error("Dados climáticos indisponíveis para esta cidade.");
        }
        const place = input;

        document.getElementById("results").innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <h2>${place}</h2>
                    <span class="weather-tag">${current.weatherDesc[0].value}</span>
                </div>
                <div class="weather-body">
                    <p><strong>Temperatura:</strong> ${current.temp_C}°C</p>
                    <p><strong>Sensação térmica:</strong> ${current.FeelsLikeC}°C</p>
                    <p><strong>Umidade:</strong> ${current.humidity}%</p>
                    <p><strong>Vento:</strong> ${current.windspeedKmph} km/h</p>
                    <p><strong>Probabilidade de chuva:</strong> ${current.chanceofrain || 'N/A'}%</p>
                </div>
            </div>
        `;
    } catch (error) {
        document.getElementById("results").innerHTML = `
            <div class="weather-card error-card">
                <p>${error.message}</p>
            </div>
        `;
    }
}

renderCityTimes();
setInterval(renderCityTimes, 1000);

document.getElementById("locationInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        ResearchWeather();
    }
});

document.getElementById("searchButton").addEventListener("click", ResearchWeather);