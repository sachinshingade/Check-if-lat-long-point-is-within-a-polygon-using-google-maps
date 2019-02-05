var drawingManager;
var shape;
var selectedShape;
    
function clearSelection() {
    if (selectedShape) {
        selectedShape.setEditable(false);
        //selectedShape = null;
    }
}

//to check the entered lat & long is exist in polygon or not?
function btnCheckPointExistence_onclick() {
    console.log("IN");
    var latitude = document.getElementById('txtLattitude').value;
    var longitude = document.getElementById('txtLongitude').value;
    var myPoint = new google.maps.LatLng(latitude, longitude);

    if (selectedShape == null) {
        alert("No Polygon");
    }
    else {

        if (checkPoint(myPoint)) {
            alert(myPoint + "is inside the polygon.");
        } else {
            alert(myPoint + "is outside the polygon.");
        }
    }
}
// Main Function to create map
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(19.0760, 72.8777),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true
    });

    var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true
    };
    // Creates a drawing manager attached to the map that allows the user to draw
    // markers, lines, and shapes.
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        markerOptions: {
            draggable: true
        },
        polylineOptions: {
            editable: true
        },
        polygonOptions: polyOptions,
        map: map
    });

// Google Maps API to drawing on google maps
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        drawingManager.setDrawingMode(null);

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
        if (e.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape, 'click', function () {
                    setSelection(newShape);
                });
                setSelection(newShape);
                shape = newShape;
        }
    });

}

//Set the map selection editable
function setSelection(shape) {
    // clearSelection();
    console.log(shape);
    selectedShape = shape;
    shape.setEditable(true);
    getCoodinates();
    // selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}

// Get Cordinate By Drawing Polygon
function getCoodinates() {

    if (selectedShape) {
            var len = selectedShape.getPath().getLength();
            console.log(selectedShape.getPath());
            var htmlStr = "";
            for (var i = 0; i < len; i++) {
                htmlStr += selectedShape.getPath().getAt(i).toUrlValue(5) + "\n";
                console.log(selectedShape.getPath().getAt(i).toUrlValue(5));
                console.log(htmlStr);
            }
            document.getElementById('info').innerHTML = htmlStr;
        }
}

//Delete the drawn polygon
function deleteSelectedShape() {
    if (selectedShape) {
        selectedShape.setMap(null);
        document.getElementById('info').innerHTML = "";
    }
}

// Check Function for point
// Ray-casting algorithm
function checkPoint(point){
    console.log(point);
    var crossings = 0,
    path = shape.getPath();

        // for each edge
    for (var i=0; i < path.getLength(); i++) {
        var a = path.getAt(i),
            j = i + 1;
        if (j >= path.getLength()) {
            j = 0;
        }
        var b = path.getAt(j);
        if (rayCrossesSegment(point, a, b)) {
            crossings++;
        }
    }

    // odd number of crossings?
    return (crossings % 2 == 1);

    function rayCrossesSegment(point, a, b) {
        var px = point.lng(),
            py = point.lat(),
            ax = a.lng(),
            ay = a.lat(),
            bx = b.lng(),
            by = b.lat();
        if (ay > by) {
            ax = b.lng();
            ay = b.lat();
            bx = a.lng();
            by = a.lat();
        }
        // alter longitude to cater for 180 degree crossings
        if (px < 0) { px += 360 };
        if (ax < 0) { ax += 360 };
        if (bx < 0) { bx += 360 };

        if (py == ay || py == by) py += 0.00000001;
        if ((py > by || py < ay) || (px > Math.max(ax, bx))) return false;
        if (px < Math.min(ax, bx)) return true;

        var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
        var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
        return (blue >= red);

    }

}
