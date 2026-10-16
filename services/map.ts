
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1">

  <link rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
    }

    #status {
      position: absolute;
      z-index: 1000;
      top: 10px;
      left: 10px;
      right: 10px;
      padding: 8px;
      background: white;
      border-radius: 6px;
      font: 13px Arial, sans-serif;
      box-shadow: 0 1px 5px #999;
    }

    .outage-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="status">Loading live power cuts...</div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    const API =
      'https://northernpowergrid.opendatasoft.com/api/explore/v2.1/catalog/datasets/live-power-cuts-data/records?limit=100';

    const map = L.map('map').setView([54.5, -1.5], 7);

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    const outageLayer = L.layerGroup().addTo(map);
    const status = document.getElementById('status');

    function getField(record, ...names) {
      const fields = record.fields || record;

      for (const name of names) {
        const key = Object.keys(fields).find(
          k => k.toLowerCase() === name.toLowerCase()
        );

        if (key != null && fields[key] != null) {
          return fields[key];
        }
      }

      return null;
    }

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char]);
    }

    async function loadOutages() {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error('API returned HTTP ' + response.status);
        }

        const data = await response.json();
        const records = data.results || [];
        outageLayer.clearLayers();

        let count = 0;

        for (const record of records) {
          const lat = Number(getField(record, 'lat', 'latitude'));
          const lng = Number(getField(record, 'lng', 'longitude'));

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            lat < 49 || lat > 56 ||
            lng < -9 || lng > 3
          ) {
            continue;
          }

          const reference = getField(record, 'reference') || 'Outage';
          const reason = getField(record, 'reason');
          const area = getField(record, 'area');
          const stage = getField(
            record,
            'customerstagesequencemessage'
          );
          const elapsed = getField(record, 'elapsedtime');
          const postcode = getField(record, 'postcode');

          const popup = \`
            <div class="outage-title">
              Power outage: \${escapeHtml(reference)}
            </div>
            <div><b>Area:</b> \${escapeHtml(area || 'Not provided')}</div>
            <br/>
            <div><b>Reason:</b> \${escapeHtml(reason || 'Not provided')}</div>
            <br/>
            <div><b>Status:</b> \${escapeHtml(stage || 'Not provided')}</div>
            <br/>
            <div><b>Postcode:</b> \${escapeHtml(postcode || 'Not provided')}</div>
            <br/>
            <div><b>Elapsed:</b> \${escapeHtml(elapsed || 'Not provided')}</div>
            <br/>
            <small>Location is approximate.</small>
          \`;

          L.marker([lat, lng])
            .bindPopup(popup)
            .addTo(outageLayer);

          count++;
        }

        status.textContent =
          count + ' outage locations loaded · Refreshes every 5 minutes';

      } catch (error) {
        console.error('Unable to load outages:', error);
        status.textContent =
          'Could not load outage data. Check connection and API response.';
      }
    }

    loadOutages();
    setInterval(loadOutages, 5 * 60 * 1000);
  </script>
</body>
</html>
`;

export const getMap = async (): Promise<string> => html;