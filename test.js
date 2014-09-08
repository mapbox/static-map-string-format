var test = require('tape'),
    polyline = require('polyline'),
    stringToFeature = require('./');

test('stringToFeature', function(t) {
    t.deepEqual(
        stringToFeature('pin-l(0,0)'),
        [{
            geometry: {
                coordinates: [0, 0],
                type: 'Point'
            },
            properties: {
                'marker-color': undefined,
                'marker-size': 'large',
                'marker-symbol': undefined
            },
            type: 'Feature'
        }], 'pin with size - large');

    t.deepEqual(
        stringToFeature('pin-s(0,0)'),
        [{
            geometry: {
                coordinates: [0, 0],
                type: 'Point'
            },
            properties: {
                'marker-color': undefined,
                'marker-size': 'small',
                'marker-symbol': undefined
            },
            type: 'Feature'
        }], 'pin with size - small');

    t.deepEqual(
        stringToFeature('pin-l+fff(0,0)'),
        [{
            geometry: {
                coordinates: [0, 0],
                type: 'Point'
            },
            properties: {
                'marker-color': 'fff',
                'marker-size': 'large',
                'marker-symbol': undefined
            },
            type: 'Feature'
        }], 'pin with size and color');

    t.deepEqual(
        stringToFeature('pin-l-bus+fff(0,0)'),
        [{
            geometry: {
                coordinates: [0, 0],
                type: 'Point'
            },
            properties: {
                'marker-color': 'fff',
                'marker-size': 'large',
                'marker-symbol': 'bus'
            },
            type: 'Feature'
        }], 'pin with size, symbol, and color');

    t.deepEqual(
        stringToFeature('url-google.com(0,0)'),
        [{
            geometry: {
                coordinates: [0, 0],
                type: 'Point'
            },
            properties: {
                'marker-url': 'google.com'
            },
            type: 'Feature'
        }], 'url marker');

    t.deepEqual(
        stringToFeature('path(' + polyline.encode([[0, 0], [1, 1]]) + ')'),
        [{
            geometry: {
                coordinates: [[0, 0], [1, 1]],
                type: 'LineString'
            },
            properties: {},
            type: 'Feature'
        }], 'path(');

    var point = { type: 'Point', coordinates: [42, 24] };
    t.deepEqual(
        stringToFeature('geojson(' + JSON.stringify(point) + ')'),
        [{
            type: 'Feature',
            properties: {},
            geometry: point
        }], 'geojson(point)');

    t.equal(stringToFeature('gibberish').message, 'Invalid marker: gibberish', 'invalid');
    t.equal(stringToFeature('path('), null, 'invalid');
    t.equal(stringToFeature('geojson(hi').message, 'Invalid GeoJSON', 'invalid');

    t.end();
});
