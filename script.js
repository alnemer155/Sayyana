const mapData = [
  { name: 'ورشة النخبة', type: 'workshop', coords: [24.774265, 46.738586], description: 'ورشة صيانة عامة ومحركات.' },
  { name: 'وكالة الصقر', type: 'agency', coords: [24.776703, 46.721561], description: 'وكالة معتمدة لصيانة السيارات.' },
  { name: 'محطة الراية', type: 'gas', coords: [24.769301, 46.692260], description: 'محطة بنزين وخدمة هواء.' },
  { name: 'شحن المستقبل', type: 'charge', coords: [24.766574, 46.713748], description: 'محطة شحن سيارات كهربائية.' },
  { name: 'ورشة الرؤية', type: 'workshop', coords: [24.779141, 46.704239], description: 'فحص شامل وقطع غيار أصلية.' },
];

const icons = {
  workshop: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  agency: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  gas: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  charge: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
};

const state = {
  filters: { workshop: true, agency: true, gas: true, charge: true },
  settings: { vehicleType: 'sedan', odometer: 12000, serviceInterval: 10000, darkMode: false },
};

function initMap() {
  const map = L.map('car-map', { zoomControl: false }).setView([24.774265, 46.738586], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  state.map = map;
  state.layers = mapData.map((item) => {
    const marker = L.marker(item.coords, { icon: icons[item.type] }).bindPopup(`<strong>${item.name}</strong><br>${item.description}`);
    marker.addTo(map);
    return { item, marker };
  });
}

function updateMarkers() {
  state.layers.forEach(({ item, marker }) => {
    if (state.filters[item.type]) {
      marker.addTo(state.map);
    } else {
      marker.remove();
    }
  });
}

function bindFilters() {
  document.querySelectorAll('.filter-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const type = event.target.dataset.type;
      state.filters[type] = event.target.checked;
      updateMarkers();
    });
  });
}

function loadSettings() {
  const saved = localStorage.getItem('car-maintenance-settings');
  if (saved) {
    Object.assign(state.settings, JSON.parse(saved));
  }

  document.getElementById('vehicle-type').value = state.settings.vehicleType;
  document.getElementById('odometer').value = state.settings.odometer;
  document.getElementById('service-interval').value = state.settings.serviceInterval;
  document.getElementById('dark-mode').checked = state.settings.darkMode;
  document.body.classList.toggle('dark-mode', state.settings.darkMode);
}

function saveSettings() {
  state.settings.vehicleType = document.getElementById('vehicle-type').value;
  state.settings.odometer = Number(document.getElementById('odometer').value) || 0;
  state.settings.serviceInterval = Number(document.getElementById('service-interval').value) || 10000;
  state.settings.darkMode = document.getElementById('dark-mode').checked;

  localStorage.setItem('car-maintenance-settings', JSON.stringify(state.settings));
  document.body.classList.toggle('dark-mode', state.settings.darkMode);
  alert('تم حفظ الإعدادات بنجاح');
}

function bindSettings() {
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  document.getElementById('dark-mode').addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', document.getElementById('dark-mode').checked);
  });
}

function init() {
  initMap();
  bindFilters();
  loadSettings();
  bindSettings();
}

window.addEventListener('DOMContentLoaded', init);
