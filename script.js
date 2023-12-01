let geocode = {
    reverseGeocode: function (latitude, longitude, day) {
    
    var api_url = "https://api.sunrisesunset.io/json";
    var request_url = api_url +
        "?lat=" + latitude + 
        "&lng=" + longitude;

    if(day == 1){
      console.log("URL : ", request_url);
      var request = new XMLHttpRequest();

      request.open("GET", request_url, true);
      request.onload = function () {

        if (request.status == 200) {
          var data = JSON.parse(request.responseText);

          const currentDate = new Date();
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedCurrentDate = currentDate.toLocaleDateString('en-US', options);
          document.querySelector(".currentdate").innerText=formattedCurrentDate; 

          document.querySelector(".timezone").innerText=data.results.timezone; 
          document.querySelector(".sunrise").innerText=data.results.sunrise; 
          document.querySelector(".sunset").innerText=data.results.sunset; 
          document.querySelector(".dawn").innerText=data.results.dawn;
          document.querySelector(".dusk").innerText=data.results.dusk;
          document.querySelector(".day_length").innerText=data.results.day_length;
          document.querySelector(".solar_noon").innerText=data.results.solar_noon;

          if(document.querySelector(".search-bar").value != "") 
            document.querySelector(".city").innerText=document.querySelector(".search-bar").value;
          else
            document.querySelector(".city").innerText=data.results.timezone;

        } else if (request.status <= 500) {
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log("error msg: " + data.status.message);
        } else {
          console.log("server error");
        }
      };
      request.onerror = function () {
        console.log("SERVER ERROR");
      };

      request.send(); 
    }else{
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;

      request_url += "&date=" + formattedTomorrow + "&formatted=0";
      console.log("URL : ", request_url);

      var request2 = new XMLHttpRequest();

      request2.open("GET", request_url, true);
      request2.onload = function () {

        if (request2.status == 200) {
          console.log("Success : ", request_url);

          var data2 = JSON.parse(request2.responseText);

          const currentDate = new Date();
          /*const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedCurrentDate = currentDate.toLocaleDateString('en-US', options);
          document.querySelector(".tomdate").innerText=formattedCurrentDate; */

          const tomorrowDate = new Date();
          tomorrowDate.setDate(currentDate.getDate() + 1); 

          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedTomorrowDate = tomorrowDate.toLocaleDateString('en-US', options);
          document.querySelector(".tomdate").innerText=formattedTomorrowDate; 

          document.querySelector(".tom_sunrise").innerText=data2.results.sunrise; 
          document.querySelector(".tom_sunset").innerText=data2.results.sunset; 
          document.querySelector(".tom_dawn").innerText=data2.results.dawn;
          document.querySelector(".tom_dusk").innerText=data2.results.dusk;
          document.querySelector(".tom_day_length").innerText=data2.results.day_length;
          document.querySelector(".tom_solar_noon").innerText=data2.results.solar_noon;

        } else if (request2.status <= 500) {
          console.log("unable to geocode! Response code: " + request2.status);
          var data = JSON.parse(request2.responseText);
          console.log("error msg: " + data2.status.message);
        } else {
          console.log("server error");
        }
      };
      request2.onerror = function () {
        console.log("SERVER ERROR");
      };

      request2.send(); 
    }
    },
    getGeoLocation: function() {
      function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude, 1); //today
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude, 2); //tomorrow
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else {
       
      }
    }
  };

document.querySelector(".search button").addEventListener("click",function(){
  document.querySelector(".error-msg").innerText="";
  locationData.search();
})

document.querySelector(".search-bar").addEventListener("keyup",function(event){
  document.querySelector(".error-msg").innerText="";
  if(event.key=="Enter"){ 
    locationData.search();
  }
  
});

document.querySelector(".geolocation button").addEventListener("click", () =>{
    document.querySelector(".error-msg").innerText="";
    document.querySelector(".search-bar").value="";
    geocode.getGeoLocation();
  
});

let locationData={ 
  fetchlocation: function(city){
    fetch("https://geocode.maps.co/search?q="+city)
    .then((response)=>{
      
      if (!response.ok) {
        document.querySelector(".error").innerText="Please check the city name for getting location details...";
        alert("No location found.");
        throw new Error("No location found.");
      }

      return response.json();
      
    })
    .then((data)=>this.displaylocation(data)); 
   },

   displaylocation: function(data){
    if (data.length > 0) {
    console.log("lat: ", data[0].lat);
    console.log("long: ", data[0].lon);

    geocode.reverseGeocode(data[0].lat, data[0].lon, 1); //today
    geocode.reverseGeocode(data[0].lat, data[0].lon, 2); //tomorrow
  }else{
    document.querySelector(".error-msg").innerText="Enter Valid City name";

    document.querySelector(".timezone").innerText="";

    document.querySelector(".sunrise").innerText=""; 
    document.querySelector(".sunset").innerText=""; 
    document.querySelector(".dawn").innerText="";
    document.querySelector(".dusk").innerText="";
    document.querySelector(".day_length").innerText="";
    document.querySelector(".solar_noon").innerText="";

    document.querySelector(".tom_sunrise").innerText=""; 
    document.querySelector(".tom_sunset").innerText=""; 
    document.querySelector(".tom_dawn").innerText="";
    document.querySelector(".tom_dusk").innerText="";
    document.querySelector(".tom_day_length").innerText="";
    document.querySelector(".tom_solar_noon").innerText="";
  }
},

   search: function(){
    document.querySelector(".city").innerText=document.querySelector(".search-bar").value; 
    this.fetchlocation(document.querySelector(".search-bar").value);
   } 
   
};

  function onError(error){
    document.querySelector(".error").innerText="ERROR FETCHING USER LOCATION"
    console.log(error.message);
  }

  geocode.getGeoLocation();
