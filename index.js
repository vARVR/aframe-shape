/* global AFRAME */
'use strict';
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * a-frame svg shape component  component for A-Frame.
 */
AFRAME.registerComponent('shape', {
    schema: {
        paths: {
            default: 'm 1 1 l -2 0 l 0 -2 l 2 0 l 0 2',
            parse:function (value) {
                value = value.replace(new RegExp("'", 'g'), "");
                return value.split('|');
            }},
        amounts: {
            default:[1],
            parse: function (value) {
                value = value.split(',');
                for(var i; i < value.length; i++){
                    value[i] = parseInt(value[i])
                }

                return value;
        }},
        colors: {
            default:['0xC07000']
        },
        steps: {
            default:[1]
        },
        center: {
            default:{x:0, y:0}
        }
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,


    transformSVGPath: function (pathStr) {
        const DEGS_TO_RADS = Math.PI / 180, UNIT_SIZE = 100;
        const DIGIT_0 = 48, DIGIT_9 = 57, COMMA = 44, SPACE = 32, PERIOD = 46, MINUS = 45;
        var path = new THREE.ShapePath();

        var idx = 1, len = pathStr.length, activeCmd,
            x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
            x1 = 0, x2 = 0, y1 = 0, y2 = 0,
            rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

        function eatNum() {
            var sidx, c, isFloat = false, s;
            // eat delims
            while (idx < len) {
                c = pathStr.charCodeAt(idx);
                if (c !== COMMA && c !== SPACE)
                    break;
                idx++;
            }
            if (c === MINUS)
                sidx = idx++;
            else
                sidx = idx;
            // eat number
            while (idx < len) {
                c = pathStr.charCodeAt(idx);
                if (DIGIT_0 <= c && c <= DIGIT_9) {
                    idx++;
                    continue;
                }
                else if (c === PERIOD) {
                    idx++;
                    isFloat = true;
                    continue;
                }

                s = pathStr.substring(sidx, idx);
                return isFloat ? parseFloat(s) : parseInt(s);
            }

            s = pathStr.substring(sidx);
            return isFloat ? parseFloat(s) : parseInt(s);
        }

        function nextIsNum() {
            var c;
            // do permanently eat any delims...
            while (idx < len) {
                c = pathStr.charCodeAt(idx);
                if (c !== COMMA && c !== SPACE)
                    break;
                idx++;
            }
            c = pathStr.charCodeAt(idx);
            return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
        }

        var canRepeat;
        activeCmd = pathStr[0];
        while (idx <= len) {
            canRepeat = true;
            switch (activeCmd) {
                // moveto commands, become lineto's if repeated
                case 'M':
                    x = eatNum();
                    y = eatNum();
                    path.moveTo(x, y);
                    activeCmd = 'L';
                    firstX = x;
                    firstY = y;
                    break;
                case 'm':
                    x += eatNum();
                    y += eatNum();
                    path.moveTo(x, y);
                    activeCmd = 'l';
                    firstX = x;
                    firstY = y;
                    break;
                case 'Z':
                case 'z':
                    canRepeat = false;
                    if (x !== firstX || y !== firstY)
                        path.lineTo(firstX, firstY);
                    break;
                // - lines!
                case 'L':
                case 'H':
                case 'V':
                    nx = (activeCmd === 'V') ? x : eatNum();
                    ny = (activeCmd === 'H') ? y : eatNum();
                    path.lineTo(nx, ny);
                    x = nx;
                    y = ny;
                    break;
                case 'l':
                case 'h':
                case 'v':
                    nx = (activeCmd === 'v') ? x : (x + eatNum());
                    ny = (activeCmd === 'h') ? y : (y + eatNum());
                    path.lineTo(nx, ny);
                    x = nx;
                    y = ny;
                    break;
                // - cubic bezier
                case 'C':
                    x1 = eatNum();
                    y1 = eatNum();
                case 'S':
                    if (activeCmd === 'S') {
                        x1 = 2 * x - x2;
                        y1 = 2 * y - y2;
                    }
                    x2 = eatNum();
                    y2 = eatNum();
                    nx = eatNum();
                    ny = eatNum();
                    path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                    x = nx;
                    y = ny;
                    break;
                case 'c':
                    x1 = x + eatNum();
                    y1 = y + eatNum();
                case 's':
                    if (activeCmd === 's') {
                        x1 = 2 * x - x2;
                        y1 = 2 * y - y2;
                    }
                    x2 = x + eatNum();
                    y2 = y + eatNum();
                    nx = x + eatNum();
                    ny = y + eatNum();
                    path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
                    x = nx;
                    y = ny;
                    break;
                // - quadratic bezier
                case 'Q':
                    x1 = eatNum();
                    y1 = eatNum();
                case 'T':
                    if (activeCmd === 'T') {
                        x1 = 2 * x - x1;
                        y1 = 2 * y - y1;
                    }
                    nx = eatNum();
                    ny = eatNum();
                    path.quadraticCurveTo(x1, y1, nx, ny);
                    x = nx;
                    y = ny;
                    break;
                case 'q':
                    x1 = x + eatNum();
                    y1 = y + eatNum();
                case 't':
                    if (activeCmd === 't') {
                        x1 = 2 * x - x1;
                        y1 = 2 * y - y1;
                    }
                    nx = x + eatNum();
                    ny = y + eatNum();
                    path.quadraticCurveTo(x1, y1, nx, ny);
                    x = nx;
                    y = ny;
                    break;
                // - elliptical arc
                case 'A':
                    rx = eatNum();
                    ry = eatNum();
                    xar = eatNum() * DEGS_TO_RADS;
                    laf = eatNum();
                    sf = eatNum();
                    nx = eatNum();
                    ny = eatNum();
                    if (rx !== ry) {
                        console.warn("Forcing elliptical arc to be a circular one :(",
                            rx, ry);
                    }
                    // SVG implementation notes does all the math for us! woo!
                    // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
                    // step1, using x1 as x1'
                    x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
                    y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
                    // step 2, using x2 as cx'
                    var norm = Math.sqrt(
                        (rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1) /
                        (rx * rx * y1 * y1 + ry * ry * x1 * x1));
                    if (laf === sf)
                        norm = -norm;
                    x2 = norm * rx * y1 / ry;
                    y2 = norm * -ry * x1 / rx;
                    // step 3
                    cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
                    cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

                    var u = new THREE.Vector2(1, 0),
                        v = new THREE.Vector2((x1 - x2) / rx,
                            (y1 - y2) / ry);
                    var startAng = Math.acos(u.dot(v) / u.length() / v.length());
                    if (u.x * v.y - u.y * v.x < 0)
                        startAng = -startAng;

                    // we can reuse 'v' from start angle as our 'u' for delta angle
                    u.x = (-x1 - x2) / rx;
                    u.y = (-y1 - y2) / ry;

                    var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
                    // This normalization ends up making our curves fail to triangulate...
                    if (v.x * u.y - v.y * u.x < 0)
                        deltaAng = -deltaAng;
                    if (!sf && deltaAng > 0)
                        deltaAng -= Math.PI * 2;
                    if (sf && deltaAng < 0)
                        deltaAng += Math.PI * 2;

                    path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
                    x = nx;
                    y = ny;
                    break;
                default:
                    throw new Error("weird path command: " + activeCmd);
            }
            // just reissue the command
            if (canRepeat && nextIsNum())
                continue;
            activeCmd = pathStr[idx++];
        }

        return path;
    },

    addGeoObject: function (group, svgObject) {
        var i, j, len, len1;
        var path, mesh, color, material, amount, simpleShapes, simpleShape, shape3d, x, toAdd, results = [];
        var thePaths = svgObject.paths;
        var theAmounts = svgObject.amounts;
        var theColors = svgObject.colors;
        var theCenter = svgObject.center;

        len = thePaths.length;
        for (i = 0; i < len; ++i) {
            path = this.transformSVGPath(thePaths[i]);

            color = new THREE.Color(0x152C50);
            material = new THREE.MeshBasicMaterial({
                color: color,
                emissive: color,
                wireframe: true
            });
            material.side = THREE.DoubleSide
           // amount = theAmounts[i];
            amount = theAmounts[i];
            simpleShapes = path.toShapes(true);
            len1 = simpleShapes.length;
            for (j = 0; j < len1; ++j) {
                simpleShape = simpleShapes[j];
                shape3d = simpleShape.extrude({
                    amount: amount,
                    bevelEnabled: false
                });
                mesh = new THREE.Mesh(shape3d, material);
                //mesh.geometry.scale( - 1, 1, 1 );
                mesh.rotation.x = Math.PI;
                mesh.translateZ(-amount - 1);
                mesh.translateX(-theCenter.x);
                mesh.translateY(-theCenter.y);
                group.add(mesh);
            }
        }
        return group;
    },

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) {
        var _g = this.addGeoObject( new THREE.Group(), this.data );
        this.el.object3D.add(_g);
    },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function () {
    },

    /**
     * Called on each scene tick.
     */
    // tick: function (t) { },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function () {
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function () {
    }
});
