const city_ip = document.getElementById('city-input');
const resultTitle = document.getElementById('risk-value');
const resultDesc = document.getElementById('risk-desc');
let selectedLat = null;
let selectedLon = null;
document.getElementById('predict-btn').addEventListener('click',
    ()=>{
        if (checkEmpty(city_ip.value)){calculate()}
        else {alert('Enter a city to predict')}
    }
);
document.getElementById('city-input').addEventListener('keydown',(e)=>{
    if (e.key=='Enter'){calculate();}
}) 

function checkEmpty(element)
{
 if (element === ' ') {return false} 
 else {return true} 
}

function calculate(){
const city = city_ip.value;
fetch('/calculate',{
    method:"POST",
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify(selectedLat ? {lat: selectedLat, lon: selectedLon} : {city: city})
    }
    )
    .then(response=> {
        return response.json();
    })
    .then(data=>{
    console.log(data.value)
    resultTitle.innerText = data.result;

    if(data.result==='SEVERE RISK!!!'){resultDesc.innerText = "Probability of flooding exceeds 70%. Evacuate low-lying areas.";}
    else if (data.result==='MODERATE RISK!!!'){resultDesc.innerText = "Probability of flooding is less than 70%. Be alert and constantly monitor the weather conditions."}
    else {resultDesc.innerText = 'Probability of flooding is low in your area..'}
    clearInterval(interval)
    showResult();
    })

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
    const interval = setInterval(() => {
        if (i < texts.length) {
            loadingText.innerText = texts[i];
            i++;
        }
    }, 1000);

};

function showResult() {
    document.getElementById('loader-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    
}

const map = L.map('map-btn').setView([20.5937, 78.9629], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', function(e) {
    selectedLat = e.latlng.lat;
    selectedLon = e.latlng.lng;
    city_ip.value = `📍 ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`;
});