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

    t.deepEqual(
        stringToFeature('path-2+f44-0.5+68a-0.25(' + polyline.encode([[0, 0], [1, 1]]) + ')'),
        [{
            geometry: {
                coordinates: [[0, 0], [1, 1]],
                type: 'LineString'
            },
            properties: {
                fill: '#68a',
                'fill-opacity': '0.25',
                stroke: '#f44',
                'stroke-opacity': '0.5',
                'stroke-width': '2'
            },
            type: 'Feature'
        }], 'path-2+f44-0.5+68a-0.25(');

    t.deepEqual(
        stringToFeature('path-2.25+f44-0.5+68a-0.25(' + polyline.encode([[0, 0], [1, 1]]) + ')'),
        [{
            geometry: {
                coordinates: [[0, 0], [1, 1]],
                type: 'LineString'
            },
            properties: {
                fill: '#68a',
                'fill-opacity': '0.25',
                stroke: '#f44',
                'stroke-opacity': '0.5',
                'stroke-width': '2.25'
            },
            type: 'Feature'
        }], 'path-2.25+f44-0.5+68a-0.25(');

    var point = { type: 'Point', coordinates: [42, 24] };
    t.deepEqual(
        stringToFeature('geojson(' + JSON.stringify(point) + ')'),
        [{
            type: 'Feature',
            properties: {},
            geometry: point
        }], 'geojson(point)');
    t.equal(stringToFeature('url-google.com(,)').message, 'Invalid marker: url-google.com(,)', 'invalid');
    t.equal(stringToFeature('pin-m(,)').message, 'Invalid marker: pin-m(,)', 'invalid');
    t.equal(stringToFeature('gibberish').message, 'Invalid marker: gibberish', 'invalid');
    t.equal(stringToFeature('path(').message, 'Invalid path syntax', 'invalid');
    t.equal(stringToFeature('path-2.25+f444-0.5+68a-0.25(').message, 'Invalid path syntax', 'invalid');
    t.equal(stringToFeature('geojson(hi').message, 'Invalid GeoJSON', 'invalid');

    t.end();
});
