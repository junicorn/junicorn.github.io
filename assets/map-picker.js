(function() {
  function debounce(fn, wait) {
    let timeoutId = null;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function createMapPicker(options) {
    const { mapContainerId, searchInputId, latitudeInputId, longitudeInputId, initialCenter } = options;
    const mapEl = document.getElementById(mapContainerId);
    const searchEl = document.getElementById(searchInputId);
    const latEl = document.getElementById(latitudeInputId);
    const lngEl = document.getElementById(longitudeInputId);

    if (!mapEl || !searchEl || !latEl || !lngEl) return null;
    if (typeof L === 'undefined') {
      console.error('Leaflet not loaded for map picker');
      return null;
    }

    const center = Array.isArray(initialCenter) && initialCenter.length === 2 ? initialCenter : [32.0853, 34.7818];
    const map = L.map(mapContainerId, { zoomControl: true }).setView(center, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ensure proper rendering when initialized in hidden containers
    // 1) Invalidate size right after init
    setTimeout(() => { try { map.invalidateSize(false); } catch (e) {} }, 0);
    // 2) Invalidate on window resize
    window.addEventListener('resize', () => {
      try { map.invalidateSize(false); } catch (e) {}
    });
    // 3) Observe visibility changes of the map container and refresh when it becomes visible
    try {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => { try { map.invalidateSize(false); } catch (e) {} }, 50);
          }
        });
      }, { threshold: 0.1 });
      io.observe(mapEl);
    } catch (e) {
      // IntersectionObserver not available; skip
    }

    let marker = null;

    function setMarker(lat, lng) {
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          latEl.value = pos.lat.toFixed(6);
          lngEl.value = pos.lng.toFixed(6);
        });
      }
      latEl.value = Number(lat).toFixed(6);
      lngEl.value = Number(lng).toFixed(6);
    }

    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      setMarker(lat, lng);
    });

    const doSearch = debounce(async function(query) {
      if (!query || query.length < 3) return;
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const results = await resp.json();
        if (Array.isArray(results) && results.length > 0) {
          const best = results[0];
          const lat = parseFloat(best.lat);
          const lon = parseFloat(best.lon);
          map.setView([lat, lon], 13);
          setMarker(lat, lon);
        }
      } catch (e) {
        console.error('Search failed', e);
      }
    }, 350);

    searchEl.addEventListener('input', (e) => doSearch(e.target.value.trim()))

    return { map, setMarker };
  }

  window.initMapPicker = function(mapContainerId, searchInputId, latitudeInputId, longitudeInputId, initialCenter) {
    return createMapPicker({ mapContainerId, searchInputId, latitudeInputId, longitudeInputId, initialCenter });
  };
})();

