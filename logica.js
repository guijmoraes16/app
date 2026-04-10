const cidades = [
    { nome: "São Paulo", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Rio de Janeiro", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Brasília", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Salvador", timeZone: "America/Bahia", gmt: "UTC-3" },
    { nome: "Fortaleza", timeZone: "America/Fortaleza", gmt: "UTC-3" },
    { nome: "Belo Horizonte", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Manaus", timeZone: "America/Manaus", gmt: "UTC-4" },
    { nome: "Curitiba", timeZone: "America/Sao_Paulo", gmt: "UTC-3" },
    { nome: "Recife", timeZone: "America/Recife", gmt: "UTC-3" },
    { nome: "Porto Alegre", timeZone: "America/Sao_Paulo", gmt: "UTC-3" }
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
        alert("Digite uma cidade!");
        return;
    }

    const url = `https://wttr.in/${encodeURIComponent(input)}?format=j1`;

    document.getElementById("results").innerHTML = `<p>Buscando clima real para ${input}...</p>`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Cidade não encontrada ou serviço indisponível");
        }

        const data = await response.json();
        const current = data.current_condition[0];
        const place = data.nearest_area?.[0]?.areaName?.[0]?.value || input;

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

document.getElementById("locationInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        ResearchWeather();
    }
});

document.getElementById("searchButton").addEventListener("click", ResearchWeather);