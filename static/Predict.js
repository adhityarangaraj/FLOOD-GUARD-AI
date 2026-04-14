const cityinput = document.getElementById('city-input');
const resultTitle = document.getElementById('risk-value');
const resultDesc = document.getElementById('risk-desc');

document.getElementById('predict-btn').addEventListener('click',
   ()=> {calculate();} 
);
document.getElementById('city-input').addEventListener('keydown',(e)=>{
    if (e.key=='Enter'){calculate();}
}) 


function calculate(){
const requestData = (selectedLat && selectedLon)
?{'lat':selectedLat,'lon':selectedLon}
:{'city':cityinput.value}

fetch('/calculate',{
    method:"POST",
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify(requestData)
    }
    )
    .then(response=> {
        return response.json();
    })
    .then(data=>{
    resultTitle.innerText = data.result;

    if(data.result==='SEVERE RISK!!!'){resultDesc.innerText = "Probability of flooding exceeds 70%. Evacuate low-lying areas.";}
    else if (data.result==='MODERATE RISK!!!'){resultDesc.innerText = "Probability of flooding is less than 70%. Be alert and constantly monitor the weather conditions."}
    else {resultDesc.innerText = 'Probability of flooding is low in your area..'}
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
    const my_promise = new Promise( (resolve,reject)=>
    {
        const interval = setInterval ( ()=> {
            if (i<texts.length){
                loadingText.innerText=texts[i];
                i++;
            }
            else{clearInterval(interval);resolve();}
        },1500)
    }).then(()=>{showResult();})

};



function showResult() {
    document.getElementById('loader-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    
}

const map = L.map('map-btn').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

const waterDropIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0077ff; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,119,255,0.8);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

let currentMarker = null;
let selectedLat = null;
let selectedLon = null;

map.on('click', function(e) {
    // In C terms, 'e' is like a pointer to the event data structure
    selectedLat = e.latlng.lat;
    selectedLon = e.latlng.lng;

cityinput.value = `📍 ${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`;
if (currentMarker) {
        currentMarker.setLatLng(e.latlng); // Move existing
    } else {
        currentMarker = L.marker(e.latlng, { icon: waterDropIcon }).addTo(map); // Create new
    }
});