// ============================================
// Step 1: Initialize the map
// ============================================

const map = L.map('map').setView([34.0200392, -118.7413787], 12);

// ============================================
// Step 2: Add a basemap
// ============================================

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ============================================
// Step 3: Add/Customize controls
// ============================================

map.zoomControl.setPosition('topright');
L.control.scale().addTo(map);

// ============================================
// Step 4: Create layer groups
// ============================================

const lineLayer = L.layerGroup().addTo(map);
const pointLayer = L.layerGroup().addTo(map);
const polygonLayer = L.layerGroup().addTo(map);

L.control.layers(null, {
  'Restaurants': pointLayer,
  'Cycleways': lineLayer,
  'City of Tucson Boundary': polygonLayer
}).addTo(map);

// ============================================
// Step 5: Load point data (Senior Living Homes)
// ============================================

fetch('data/Senior_Housing.geojson')
  .then(res => res.json())
  .then(data => {L.geoJSON(data, {

      // Style points as circle markers
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: '#d95f02',
          color: '#ffffff',
          weight: 1,
          fillOpacity: 0.9
        });
      },

      // Add popups
      onEachFeature: function(feature, layer) {
        const name = feature.properties.name || 'Name';
        layer.bindPopup(`<strong>${name}</strong>`);
      }

    }).addTo(pointLayer);

  })
  .catch(err => console.error('Error loading senior housing:', err));

// ============================================
// Step 6: Load line data (Metro Bus Routes)
// ============================================

fetch('data/Metro_Bus_Lines.geojson')
  .then(res => res.json())
  .then(data => {L.geoJSON(data, {

      // Style lines
      style: function(feature) {
        return {
          color: '#1b9e77',
          weight: 3
        };
      },
    }).addTo(lineLayer);

  })
  .catch(err => console.error('Error loading bus routes:', err));

// ============================================
// Step 7: Load polygon data (LA City Parks)
// ============================================

fetch('data/Los_Angeles_City_Parks_Boundaries.geojson')
  .then(res => res.json())
  .then(data => {

    // Add polygon and immediately fit to its bounds
    map.fitBounds(
      L.geoJSON(data, {
        style: function() {
          return {
            color: '#7570b3',
            weight: 3,
            fill: false
          };
        }
      })
      .addTo(polygonLayer)
      .getBounds()
    );

  })
  .catch(err => console.error('Error loading city parks:', err));
