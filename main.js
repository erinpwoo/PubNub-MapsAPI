    window.lat = 37.7850;
    window.lng = -122.4383;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition);
        }
      
        return null;
    };

    function updatePosition(position) {
      if (position) {
        window.lat = position.coords.latitude;
        window.lng = position.coords.longitude;
      }
    }
    
    setInterval(function(){updatePosition(getLocation());}, 10000);
      
    function currentLocation() {
      return {lat:window.lat, lng:window.lng};
    };

    var map;
    var mark;

    var initialize = function() {
      map  = new google.maps.Map(document.getElementById('map-canvas'), {center:{lat:lat,lng:lng},zoom:12});
      mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
    };

    window.initialize = initialize;

    var redraw = function(payload) {
      lat = payload.message.lat;
      lng = payload.message.lng;

      map.setCenter({lat:lat, lng:lng, alt:0});
      mark.setPosition({lat:lat, lng:lng, alt:0});
    };

    var pnChannel = "map2-channel";

    var pubnub = new PubNub({
      publishKey:   'pub-c-4b91b298-05f8-435d-9443-b97cdff628af',
      subscribeKey: 'sub-c-44685a68-117b-11e9-a971-425ad67106f3'
    });

    pubnub.subscribe({channels: [pnChannel]});
    pubnub.addListener({message:redraw});

    setInterval(function() {
      pubnub.publish({channel:pnChannel, message:currentLocation()});
    }, 5000);