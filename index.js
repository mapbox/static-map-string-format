var geojsonNormalize = require('geojson-normalize'),
    csscolorparser = require('csscolorparser').parseCSSColor,
    geojsonhint = require('geojsonhint'),
    polyline = require('polyline');

module.exports = function stringToFeature(str) {
    var matchURL = /^(url)(?:-([^\(]+))()\((-?\d+(?:.\d+)?),(-?\d+(?:.\d+)?)/,
        matchGeoJSON = /^geojson\(([^\)]+)/,
        matchPath = /^path(-([\.\d]+))?(\+([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(-([\.\d]+))?)?(\+([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(-([\.\d]+))?)?\(([^\)]+)/,
        matchFile = /^pin-(s|m|l)(?:-([a-z0-9-]+))?(?:\+([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?\((-?\d+(?:.\d+)?),(-?\d+(?:.\d+)?)/,
        isURL = str.indexOf('url-') === 0,
        isGeoJSON = str.indexOf('geojson(') === 0,
        isPolyline = str.indexOf('path') === 0,
        marker;

    var sizes = { s: 'small', m: 'medium', l: 'large' };

    if (isURL) {
        marker = str.match(matchURL);
        if (!marker) return null;
        return [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(marker[4]), parseFloat(marker[5])]
            },
            properties: {
                'marker-url': marker[2]
            }
        }];
    } else if (isGeoJSON) {
        marker = str.match(matchGeoJSON);
        if (!marker) return null;
        try {
            if (geojsonhint.hint(marker[1]).length) {
                return new Error('Invalid GeoJSON');
            }
            var parsed = JSON.parse(marker[1]);
            var norm = geojsonNormalize(parsed);
            return norm.features;
        } catch(e) {
            return new Error('Invalid GeoJSON');
        }
    } else if (isPolyline) {
        marker = str.match(matchPath);
        if (!marker) return null;
        var properties = {
            'stroke-width': marker[2],
            stroke: formatColor(marker[4]),
            'stroke-opacity': marker[6],
            fill: formatColor(marker[8]),
            'fill-opacity': marker[10]
        };
        Object.keys(properties).forEach(function(k) {
            if (!properties[k]) delete properties[k];
        });
        var encodedLine = marker[11];
        if (!encodedLine) return null;
        var decoded = polyline.decode(encodedLine);
        if (!decoded) return null;
        var feature = [{
            type: 'Feature',
            properties: properties,
            geometry: {
                type: 'LineString',
                coordinates: decoded.map(function(pair) {
                    return pair.reverse();
                })
            }
        }];
        return feature;
    } else {
        marker = str.match(matchFile);
        if (!marker || isNaN(parseFloat(marker[4])) || isNaN(parseFloat(marker[5]))) {
            return new Error('Invalid marker: ' + str);
        }
        return [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(marker[4]), parseFloat(marker[5])]
            },
            properties: {
                'marker-size': sizes[marker[1]],
                'marker-symbol': marker[2],
                'marker-color': marker[3]
            }
        }];
    }
}

function formatColor(str) {
    if (!str) return null;
    var parsed = csscolorparser('#' + str);
    if (!parsed) return null;
    return 'rgba(' + parsed.join(',') + ')';
}
