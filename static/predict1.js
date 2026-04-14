// ─── State: coordinates selected from map ───────────────────────────────────
let selectedLat = null;
let selectedLng = null;
 
// ─── DOM refs ─────────────────────────────────────────────────────────────────
const cityInput     = document.getElementById('city-input');
const resultTitle   = document.getElementById('risk-value');
const resultDesc    = document.getElementById('risk-desc');
const predictBtn    = document.getElementById('predict-btn');
const mapBtn        = document.getElementById('map-btn');
const mapModal      = document.getElementById('map-modal');
const mapCloseBtn   = document.getElementById('map-close-btn');
const mapConfirmBtn = document.getElementById('map-confirm-btn');
const coordsDisplay = document.getElementById('map-coords-display');
 
// ─── Predict button ───────────────────────────────────────────────────────────
predictBtn.addEventListener('click', () => {
  // Priority: map coordinates > city text input
  if (selectedLat !== null && selectedLng !== null) {
    calculate(null, selectedLat, selectedLng);
  } else if (cityInput.value.trim() !== '') {
    calculate(cityInput.value.trim(), null, null);
  } else {
    cityInput.style.border = '2px solid #ff4757';
    cityInput.placeholder = 'Please enter a city or select from map!';
    setTimeout(() => {
      cityInput.style.border = '';
      cityInput.placeholder = 'Enter City Name (e.g., Chennai, Mumbai)';
    }, 2500);
  }
});
 
// Enter key on city input
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (cityInput.value.trim() !== '') {
      calculate(cityInput.value.trim(), null, null);
    }
  }
});
 
// ─── Main calculate function ──────────────────────────────────────────────────
function calculate(city, lat, lng) {
  // Hide input card, show loader
  document.getElementById('input-card').classList.add('hidden');
  document.getElementById('loader-section').classList.remove('hidden');
 
  // Cycling loading messages
  const loadingText = document.getElementById('loading-text');
  const texts = [
    'Locating City...',
    'Fetching current weather info...',
    'Analyzing Cloud Patterns...',
    'Processing ML Risk Models...',
    'Finalizing Assessment...'
  ];
  let i = 0;
  loadingText.innerText = texts[0];
  const interval = setInterval(() => {
    i++;
    if (i < texts.length) loadingText.innerText = texts[i];
  }, 1000);
 
  // Build request payload
  const payload = {};
  if (city) {
    payload.city = city;
  } else {
    payload.lat = lat;
    payload.lng = lng;
  }
 
  fetch('/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      clearInterval(interval);
 
      // Apply risk styling
      const resultCard = document.querySelector('.result-card');
      resultCard.classList.remove('high-risk', 'mod-risk', 'low-risk');
 
      resultTitle.innerText = data.result;
 
      if (data.result === 'SEVERE RISK!!!') {
        resultDesc.innerText = 'Probability of flooding exceeds 70%. Evacuate low-lying areas immediately.';
        resultCard.classList.add('high-risk');
      } else if (data.result === 'MODERATE RISK!!!') {
        resultDesc.innerText = 'Probability of flooding is between 10–70%. Stay alert and monitor weather conditions closely.';
        resultCard.classList.add('mod-risk');
      } else {
        resultDesc.innerText = 'Probability of flooding is low in your area. Remain cautious during heavy rainfall.';
        resultCard.classList.add('low-risk');
      }
 
      showResult();
    })
    .catch(err => {
      clearInterval(interval);
      resultTitle.innerText = 'Error';
      resultDesc.innerText = 'Could not fetch prediction. Please try again.';
      document.querySelector('.result-card').classList.remove('high-risk', 'mod-risk', 'low-risk');
      showResult();
      console.error('Fetch error:', err);
    });
}
 
function showResult() {
  document.getElementById('loader-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');
}
 
// ─── Leaflet Map Setup ────────────────────────────────────────────────────────
let leafletMap = null;
let marker    = null;
 
mapBtn.addEventListener('click', openMapModal);
 
function openMapModal() {
  mapModal.classList.add('open');
 
  // Initialize map only once
  if (!leafletMap) {
    leafletMap = L.map('leaflet-map').setView([20.5937, 78.9629], 5); // Centre on India
 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(leafletMap);
 
    leafletMap.on('click', onMapClick);
  }
 
  // Fix rendering glitch when modal opens
  setTimeout(() => leafletMap.invalidateSize(), 100);
}
 
function onMapClick(e) {
  const { lat, lng } = e.latlng;
 
  // Place / move marker
  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(leafletMap);
  }
 
  // Store coordinates
  selectedLat = lat;
  selectedLng = lng;
 
  // Update footer display
  coordsDisplay.innerText = `📍 Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  mapConfirmBtn.disabled = false;
 
  // Also update city input to reflect map selection
  cityInput.value = `Map pin: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
}
 
// Confirm button closes modal and keeps coordinates
mapConfirmBtn.addEventListener('click', () => {
  closeMapModal();
});
 
// Close button clears selection
mapCloseBtn.addEventListener('click', () => {
  closeMapModal();
});
 
// Click outside modal inner to close
mapModal.addEventListener('click', (e) => {
  if (e.target === mapModal) closeMapModal();
});
 
function closeMapModal() {
  mapModal.classList.remove('open');
}