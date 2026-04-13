const city = document.getElementById('city-input').value;
const resultTitle = document.getElementById('risk-value');
const resultDesc = document.getElementById('risk-desc');

document.getElementById('predict-btn').addEventListener('click',
    ()=>{
        if (checkEmpty(city)){calculate()}
        else {console.alert('Enter a city to predict')}
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
fetch('/calculate',{
    method:"POST",
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify({'city':city})
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

// Simple Map Selection Mockup
document.getElementById('map-btn').addEventListener('click', function() {
    document.getElementById('city-input').value = "Coordinates: 10.7870° N, 79.1378° E";
    alert("Location pinned via Map!");
});
