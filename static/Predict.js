const cityinput = document.getElementById('city-input');
const resultTitle = document.getElementById('risk-value');
const resultDesc = document.getElementById('risk-desc');
const resultCard = document.getElementById('result-card-box');
const infoBox = document.getElementById('info-box');
const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');

let controlLoad = 0;
let finalData = null; // To store result for showResult()

document.getElementById('predict-btn').addEventListener('click', () => { calculate(); });
document.getElementById('city-input').addEventListener('keydown', (e) => {
    if (e.key == 'Enter') { calculate(); }
})

document.getElementById('close-error').addEventListener('click', () => {
    errorToast.classList.add('hidden');
});

function calculate() {
    errorToast.classList.add('hidden');
    const requestData = (selectedLat && selectedLon)
        ? { 'lat': selectedLat, 'lon': selectedLon }
        : { 'city': cityinput.value }

    fetch('/calculate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        finalData = data;
        if (data.ok) {
            controlLoad = 0;
        } else {
            controlLoad = (data.type === 1) ? 1 : 2;
        }
    });

    // Hide Input, Show Loader
    document.getElementById('input-card').classList.add('hidden');
    document.getElementById('loader-section').classList.remove('hidden');

    const loadingText = document.getElementById('loading-text');
    const texts = [
        "Locating City",
        "Getting City's current weather info",
        "Analyzing Cloud Patterns...",
        "Processing ML Risk Models...",
        "Finalizing Assessment..."
    ];

    let i = 0;
    const my_promise = new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (i < texts.length) {
                loadingText.innerText = texts[i];
                i++;
                if (controlLoad === 1 && i === 2) { clearInterval(interval); resolve(); }
                else if (controlLoad === 2 && i === 3) { clearInterval(interval); resolve(); }
            } else { clearInterval(interval); resolve(); }
        }, 1500)
    }).then(() => { showResult(); })
};

function showResult() {
    document.getElementById('loader-section').classList.add('hidden');

    if (finalData && finalData.ok) {
        document.getElementById('result-section').classList.remove('hidden');
        resultTitle.innerText = finalData.result;

        // Dynamic Styling & Interesting Facts
        if (finalData.result === 'SEVERE RISK!!!') {
            resultCard.className = "result-card bg-severe";
            resultDesc.innerText = "Probability exceeds 70%. Evacuate low-lying areas.";
            infoBox.innerHTML = `
                <h3>🚨 Emergency Precautions</h3>
                <ul class="precautions-list">
                    <li>Move to higher ground immediately.</li>
                    <li>Turn off all electrical utilities.</li>
                    <li>Keep an emergency kit ready.</li>
                </ul>
                <div class="contacts">
                    <div class="contact-item"><strong>NDRF:</strong> 011-24363260</div>
                    <div class="contact-item"><strong>Police:</strong> 100</div>
                </div>`;
        } 
        else if (finalData.result === 'MODERATE RISK!!!') {
            resultCard.className = "result-card bg-moderate";
            resultDesc.innerText = "Probability is significant. Be alert.";
            infoBox.innerHTML = `
                <h3>🌦️ Community Insight</h3>
                <p style="font-size:0.9rem; line-height:1.5;">Floods are often caused by the <b>"Urban Heat Island"</b> effect where cities trap more heat, leading to sudden intense rainfall. Stay indoors and ensure your local drainage is clear.</p>
                <div class="contact-item" style="margin-top:10px;">Check local weather news every 2 hours.</div>`;
        } 
        else {
            resultCard.className = "result-card bg-low";
            resultDesc.innerText = 'Probability of flooding is low in your area.';
            infoBox.innerHTML = `
                <h3>🌱 Eco-Fact</h3>
                <p style="font-size:0.9rem; line-height:1.5;">Did you know? Mangroves and wetlands act as natural sponges, absorbing millions of gallons of water during storms. Protecting them is our best flood defense!</p>
                <button onclick="window.open('https://www.unep.org')" class="btn-secondary" style="font-size:0.8rem;">Learn about Conservation</button>`;
        }
    } else {
        // Show Input Screen again with Error Toast
        document.getElementById('input-card').classList.remove('hidden');
        errorMessage.innerText = finalData ? finalData.result : "Connection failed.";
        errorToast.classList.remove('hidden');
    }
}

// Leaflet Map logic (Same as yours)
const map = L.map('map-btn').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
const waterDropIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0077ff; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});
let currentMarker = null; let selectedLat = null; let selectedLon = null;
map.on('click', function(e) {
    selectedLat = e.latlng.lat;
    selectedLon = e.latlng.lng;
    cityinput.value = `📍 ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`;
    if (currentMarker) { currentMarker.setLatLng(e.latlng); } 
    else { currentMarker = L.marker(e.latlng, { icon: waterDropIcon }).addTo(map); }
});

