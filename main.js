var mymap = L.map('map').setView([-23.16, 21.63], 5.47);

// Limiter la carte sur notre zone d'étude le Namibie
mymap.setMaxBounds([[-34.35, 3.57], [-14.50, 29.94]]);
mymap.setMinZoom(4);


//Définir les couches de bases
var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var lightLayer = L.tileLayer('https://api.mapbox.com/styles/v1/aaelio/clctcnyy000zq14s1zfm3lsxo/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWFlbGlvIiwiYSI6ImNsYTYwNndrZTBjMnIzb3F6NHU3OWxjaHcifQ.M6GViMHYNuaqnbss0cqVOw', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
    }
);

var darkLayer = L.tileLayer('https://api.mapbox.com/styles/v1/aaelio/clctefk7q001u14mtd6jr5qje/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWFlbGlvIiwiYSI6ImNsYTYwNndrZTBjMnIzb3F6NHU3OWxjaHcifQ.M6GViMHYNuaqnbss0cqVOw', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
    }
);

var satelitte = L.tileLayer('https://api.mapbox.com/styles/v1/aaelio/clctejkku002715l6edz1m1ph/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWFlbGlvIiwiYSI6ImNsYTYwNndrZTBjMnIzb3F6NHU3OWxjaHcifQ.M6GViMHYNuaqnbss0cqVOw', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
});

lightLayer.addTo(mymap);

//Créer des boutons pour changer les couches des bases
var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Satelitte": satelitte,
    "Claire": lightLayer,
    "Sombre": darkLayer
};
var layerControl = L.control.layers(baseMaps).addTo(mymap);


//Création des variables les styles pour les différents types de parcs
var np_style = {
    "fillColor": "#85b66f",
    "color": '#000',
    "opacity": 0.1,
    "fillOpacity": 1};

var gp_style = {
    "fillColor": "#beb297",
    "color": '#000',
    "opacity": 0.1,
    "fillOpacity": 1};

var ma_style = {
    "fillColor": "#91c8ce",
    "color": '#000',
    "opacity": 0.1,
    "fillOpacity": 1};

var cc_style = {
    "fillColor": "#d77353",
    "color": '#000',
    "opacity": 0.1,
    "fillOpacity": 1};

// Preparer les groupes de couches pour les categories
var national_park = L.layerGroup();
var game_park = L.layerGroup();
var marine_area = L.layerGroup();
var communal_conservancy = L.layerGroup();
// Creer une variable qui contient les differents groupes
var layer_groups = [national_park, game_park, marine_area, communal_conservancy];

//Fonction pour faire apparaître les noms des parcs sur la carte: failed
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NAME) {
        layer.bindTooltip(feature.properties.NAME);
    }
    layer.on('click', function (e) {
        console.log(e.target.feature.properties);
        var html = '<h3>'+ e.target.feature.properties.NAME +'</h3>'
        var details = parcs_details[e.target.feature.properties.id]
        html += "<img src='" + details.image + "'width='400' height='250'/>'"
        html += '<p>' + details.description + '</p>'
        document.querySelector('.infos-parc').innerHTML = html
    });
        
    // Verifier a quelle categorie appartient le parc et
    // mettre le style et dans le groupe de couche en question
    if (feature.properties.DESIGNATIO === "National Park") {
        layer.setStyle(np_style)
        national_park.addLayer(layer);
    }
    else if (feature.properties.DESIGNATIO === "Game Park") {
        layer.setStyle(gp_style)
        game_park.addLayer(layer);
    }
    else if (feature.properties.DESIGNATIO === "Marine Protected Area") {
        layer.setStyle(ma_style)
        marine_area.addLayer(layer);
    }
    else if (feature.properties.DESIGNATIO === "Communal Conservancy") {
        layer.setStyle(cc_style)
        communal_conservancy.addLayer(layer);
    }
};
// Ajouter les parcs dans les groupes
var parks_layer = L.geoJSON(parcs, {
    onEachFeature: onEachFeature
});
// Ajouter les groupes a la carte
layer_groups.forEach(group => group.addTo(mymap));



//Cette fonction va permettre à l'utilisateur de sélectionner et délectionner les cases qui correspondent à chaque type de carte
clickmark = null

// //parc nationaux
document.querySelector("input[name=parc_nationaux]").addEventListener('change', function() {
                if(this.checked) mymap.addLayer(national_park)
                  else mymap.removeLayer(national_park)
                    if (clickmark != undefined) {  //i.e. if it exists...
                    //function all to remove the yellow select circle, could call function to clear table from here.
                        mymap.removeLayer(clickmark);
                    };
                })

//réserves naturelles              
document.querySelector("input[name=reserve_naturel]").addEventListener('change', function() {
                if(this.checked) mymap.addLayer(game_park)
                  else mymap.removeLayer(game_park)
                    if (clickmark != undefined) {
                        map.removeLayer(clickmark);
                    };
                })

//communes
document.querySelector("input[name=zone_comm]").addEventListener('change', function() {
                if(this.checked) mymap.addLayer(communal_conservancy)
                  else mymap.removeLayer(communal_conservancy)
                    if (clickmark != undefined) {
                        mymap.removeLayer(clickmark);
                    };
                })

//zone maritimes               
document.querySelector("input[name=zone_marine]").addEventListener('change', function() {
                if(this.checked) mymap.addLayer(marine_area)
                  else mymap.removeLayer(marine_area)
                    if (clickmark != undefined) {
                        map.removeLayer(clickmark);
                    };
                })
