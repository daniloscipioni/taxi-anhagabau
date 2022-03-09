function initialize() {
  initMap();
  initAutocomplete();
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initAutocomplete() {

  // Create the search box and link it to the UI element.
  const input = document.getElementById("start");
  const input2 = document.getElementById("end");
  const searchBox = new google.maps.places.SearchBox(input);
  const searchBox2 = new google.maps.places.SearchBox(input2);

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    searchBox.getPlaces();


  }, false);

  searchBox2.addListener("places_changed", () => {
    searchBox2.getPlaces();


  }, false);



}


function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: -23.18, lng: -46.89 },
  });

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {

    let valida = validaCampos();
    $("#valida-start").css("display", "none");
    $("#valida-end").css("display", "none");
    if(!valida.validaStart){
     $("#valida-start").css("display", "block");
    }
    
    if(!valida.validaEnd){
    $("#valida-end").css("display", "block");
    }
    if(valida.validaStart && valida.validaEnd ){
      $("#loading").css("display", "inline");
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  
  };

  const getCurrentLocation1 = function () {
    getCurrentLocation();
  };

  const btn = document.getElementById("calcular")
  btn.addEventListener("click", onChangeHandler);

  const btnCurrentLocation =  document.getElementById("currentLocation")
  btnCurrentLocation.addEventListener("click", getCurrentLocation1);
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.getElementById("start").value,
      },
      destination: {
        query: document.getElementById("end").value,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      setTimeout(() => {
        $("#loading").css("display", "none");
      
      
      let result = calcValue(response.routes[0].legs[0].distance.value, response.routes[0].legs[0].duration.value);

      document.getElementById("distancia").innerHTML = response.routes[0].legs[0].distance.text
      document.getElementById("tempo").innerHTML = response.routes[0].legs[0].duration.text
      document.getElementById("valor").innerHTML = "R$ " + result.replace('.',',')
    }, 1000);
      
    })
    .catch((e) => window.alert("Falha na requisição " + e));
}




function getCurrentLocation() {

  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
       
        geocoder
        .geocode({ location: pos })
        .then((response) => {
          if (response.results[0]) {
        
            document.getElementById("start").value = response.results[0].formatted_address;
          
          } else {
            window.alert("No results found");
          }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
       

      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
    
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


}




function calcValue(distance, duration){

 
  let distanceValue = distance / 1000;
  let durationValue = duration / 3600;
  let bandeirada = parseFloat("5.50");
  let tempoPercurso = parseFloat("30.00");
  let km_band1 = parseFloat("3.50");
  let km_band2 = parseFloat("4.20");

  var bandeira = $('input[name=band]:checked').val() == "band1" ? km_band1 : km_band2

  return (bandeirada + distanceValue * bandeira + (durationValue / 3) * tempoPercurso).toFixed(2);

}

function validaCampos() {
  let validaStart = true;
  let validaEnd = true;

  if ($('#start').val() == '') {  
    validaStart = false;  
  }

  if ($('#end').val() == '') { 
    validaEnd = false;
  }

  return {validaStart:validaStart, validaEnd:validaEnd};
}