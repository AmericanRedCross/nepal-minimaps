var map = L.map('map').setView([0, 0], 2);

var info = L.control();

function overFeature(e) {
    var layer = e.target;
		info.update(layer.feature.properties);
}
function outFeature(e) {
	info.update();
}
function clickFeature(e) {
    var links = [{
        title: e.target.feature.properties.place,
        href: 'img/pics/' + e.target.feature.properties.image,
        type: 'image/jpeg'
    }]
    var options = {
      toggleControlsOnReturn: false,
    }
    blueimp.Gallery(links, options);
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: overFeature,
        mouseout: outFeature,
        click: clickFeature
    });
}


L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(map);

var lineLayer = L.geoJson(trip, {
  style: {
      "weight": 5,
      "opacity": 0.65,
      "clickable": false
  }
}).addTo(map);

var markerLayer = L.geoJson(points, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.MakiMarkers.icon({icon: feature.properties["marker-symbol"], color: feature.properties["marker-color"], size: feature.properties["marker-size"]})
    });
  },
  onEachFeature: onEachFeature
}).addTo(map);


map.fitBounds(lineLayer.getBounds().pad(0.2));

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    infoHtml = '<h3 style="margin:12px;">Nuwakot field visit</h3>';
    if(props){
      infoHtml += '<h4>' + props.place + '</b><br><small><i>Click for picture<i></small></h4>';
    } else {
      infoHtml += '<h4>&nbsp;<br><small><i>Hover over a marker</i><br></small></h4>';
    }
    this._div.innerHTML = infoHtml;
};
info.addTo(map);
