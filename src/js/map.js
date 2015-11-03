function initialize() {
  var mapCanvas = document.getElementById('map');
  var map = new google.maps.Map(mapCanvas);
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463), // WHERE TO CENTER THE MAP
    zoom: 8, // BETWEEN 0(FAR) - 22(CLOSE)
    mapTypeId: google.maps.mapTypeId.ROADMAP // SPECIFY TYPE OF MAP TO USE (other opt: SATELLITE, HYBRID, TERRAIN)
  };
}

google.maps.event.addDomListener(window, 'load', initialize);
