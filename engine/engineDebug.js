/*
    LittleJS - Debug Build
    MIT License - Copyright 2021 Frank Force
*/

/** 
 * LittleJS Debug System
 * <br> - Press ~ to show debug overlay with mouse pick
 * <br> - Number keys toggle debug functions
 * <br> - Debug primitive rendering
 * <br> - Save a 2d canvas as an image
 * @namespace Debug
 */

'use strict';

/** True if debug is enabled
 *  @default
 *  @memberof Debug */
const debug = 1;

/** True if asserts are enaled
 *  @default
 *  @memberof Debug */
const enableAsserts = 1;

/** Size to render debug points by default
 *  @default
 *  @memberof Debug */
const debugPointSize = .5;

/** True if watermark with FPS should be down
 *  @default
 *  @memberof Debug */
let showWatermark = 1;

/** True if god mode is enabled, handle this however you want
 *  @default
 *  @memberof Debug */
let godMode = 0;

// Engine internal variables not exposed to documentation
let debugPrimitives = [], debugOverlay = 0, debugPhysics = 0, debugRaycast = 0,
debugParticles = 0, debugGamepads = 0, debugMedals = 0, debugTakeScreenshot, downloadLink;

///////////////////////////////////////////////////////////////////////////////
// Debug helper functions

/** Asserts if the experssion is false, does not do anything in release builds
 *  @param {Boolean} assertion
 *  @param {Object}  output
 *  @memberof Debug */
const ASSERT = enableAsserts ? (...assert)=> console.assert(...assert) : ()=>{};

/** Draw a debug rectangle in world space
 *  @param {Vector2} pos
 *  @param {Vector2} [size=new Vector2()]
 *  @param {String}  [color='#fff']
 *  @param {Number}  [time=0]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [fill=0]
 *  @memberof Debug */
const debugRect = (pos, size=vec2(), color='#fff', time=0, angle=0, fill=0)=> 
{
    ASSERT(typeof color == 'string'); // pass in regular html strings as colors
    debugPrimitives.push({pos, size:vec2(size), color, time:new Timer(time), angle, fill});
}

/** Draw a debug circle in world space
 *  @param {Vector2} pos
 *  @param {Number}  [radius=0]
 *  @param {String}  [color='#fff']
 *  @param {Number}  [time=0]
 *  @param {Boolean} [fill=0]
 *  @memberof Debug */
const debugCircle = (pos, radius=0, color='#fff', time=0, fill=0)=>
{
    ASSERT(typeof color == 'string'); // pass in regular html strings as colors
    debugPrimitives.push({pos, size:radius, color, time:new Timer(time), angle:0, fill});
}

/** Draw a debug point in world space
 *  @param {Vector2} pos
 *  @param {String}  [color='#fff']
 *  @param {Number}  [time=0]
 *  @param {Number}  [angle=0]
 *  @memberof Debug */
const debugPoint = (pos, color, time, angle)=> debugRect(pos, 0, color, time, angle);

/** Draw a debug line in world space
 *  @param {Vector2} posA
 *  @param {Vector2} posB
 *  @param {String}  [color='#fff']
 *  @param {Number}  [thickness=.1]
 *  @param {Number}  [time=0]
 *  @memberof Debug */
const debugLine = (posA, posB, color, thickness=.1, time)=>
{
    const halfDelta = vec2((posB.x - posA.x)/2, (posB.y - posA.y)/2);
    const size = vec2(thickness, halfDelta.length()*2);
    debugRect(posA.add(halfDelta), size, color, time, halfDelta.angle(), 1);
}

/** Draw a debug axis aligned bounding box in world space
 *  @param {Vector2} posA
 *  @param {Vector2} sizeA
 *  @param {Vector2} posB
 *  @param {Vector2} sizeB
 *  @param {String}  [color='#fff']
 *  @memberof Debug */
const debugAABB = (pA, sA, pB, sB, color)=>
{
    const minPos = vec2(min(pA.x - sA.x/2, pB.x - sB.x/2), min(pA.y - sA.y/2, pB.y - sB.y/2));
    const maxPos = vec2(max(pA.x + sA.x/2, pB.x + sB.x/2), max(pA.y + sA.y/2, pB.y + sB.y/2));
    debugRect(minPos.lerp(maxPos,.5), maxPos.subtract(minPos), color);
}

/** Draw a debug axis aligned bounding box in world space
 *  @param {String}  text
 *  @param {Vector2} pos
 *  @param {Number}  [size=1]
 *  @param {String}  [color='#fff']
 *  @param {Number}  [time=0]
 *  @param {Number}  [angle=0]
 *  @param {String}  [font='monospace']
 *  @memberof Debug */
const debugText = (text, pos, size=1, color='#fff', time=0, angle=0, font='monospace')=> 
{
    ASSERT(typeof color == 'string'); // pass in regular html strings as colors
    debugPrimitives.push({text, pos, size, color, time:new Timer(time), angle, font});
}

/** Clear all debug primitives in the list
 *  @memberof Debug */
const debugClear = ()=> debugPrimitives = [];

/** Save a canvas to disk 
 *  @param {HTMLCanvasElement} canvas
 *  @param {String}            [filename]
 *  @memberof Debug */
const debugSaveCanvas = (canvas, filename = engineName + '.png') =>
{
    downloadLink.download = 'screenshot.png';
    downloadLink.href = canvas.toDataURL('image/png').replace('image/png','image/octet-stream');
    downloadLink.click();
}

///////////////////////////////////////////////////////////////////////////////
// Engine debug function (called automatically)

const debugInit = ()=>
{
    // create link for saving screenshots
    document.body.appendChild(downloadLink = document.createElement('a'));
    downloadLink.style.display = 'none';
}

const debugUpdate = ()=>
{
    if (!debug)
        return;
        
    if (keyWasPressed(192)) // ~
        debugOverlay = !debugOverlay;
    if (debugOverlay)
    {
        if (keyWasPressed(49)) // 1
            debugPhysics = !debugPhysics, debugParticles = 0;
        if (keyWasPressed(50)) // 2
            debugParticles = !debugParticles, debugPhysics = 0;
        if (keyWasPressed(51)) // 3
            godMode = !godMode;
        if (keyWasPressed(53)) // 5
            debugTakeScreenshot = 1;
        //if (keyWasPressed(54)) // 6
        //    debugToggleParticleEditor();
        if (keyWasPressed(55)) // 7
            debugGamepads = !debugGamepads;
        //if (keyWasPressed(56)) // 8
        //if (keyWasPressed(57)) // 9
        if (keyWasPressed(48)) // 0
            showWatermark = !showWatermark;
    }
}

const debugRender = ()=>
{
    glCopyToContext(mainContext);

    if (debugTakeScreenshot)
    {
        // composite canvas
        glCopyToContext(mainContext, 1);
        mainContext.drawImage(overlayCanvas, 0, 0);
        overlayCanvas.width |= 0;

        debugSaveCanvas(mainCanvas);
        debugTakeScreenshot = 0;
    }

    if (debugGamepads && gamepadsEnable && navigator.getGamepads)
    {
        // poll gamepads
        const gamepads = navigator.getGamepads();
        for (let i = gamepads.length; i--;)
        {
            const gamepad = gamepads[i];
            if (gamepad)
            {
                // gamepad debug display
                const stickScale = 1;
                const buttonScale = .2;
                const centerPos = cameraPos;
                const sticks = stickData[i];
                for (let j = sticks.length; j--;)
                {
                    const drawPos = centerPos.add(vec2(j*stickScale*2,i*stickScale*3));
                    const stickPos = drawPos.add(sticks[j].scale(stickScale));
                    debugCircle(drawPos, stickScale, '#fff7',0,1);
                    debugLine(drawPos, stickPos, '#f00');
                    debugPoint(stickPos, '#f00');
                }
                for (let j = gamepad.buttons.length; j--;)
                {
                    const drawPos = centerPos.add(vec2(j*buttonScale*2, i*stickScale*3-stickScale-buttonScale));
                    const pressed = gamepad.buttons[j].pressed;
                    debugCircle(drawPos, buttonScale, pressed ? '#f00' : '#fff7', 0, 1);
                    debugText(j, drawPos, .2);
                }
            }
        }
    }

    if (debugOverlay)
    {
        // mouse pick
        let bestDistance = Infinity, bestObject;
        for (const o of engineObjects)
        {
            if (o.canvas || o.destroyed)
                continue; // skip tile layers

            const size = o.size.copy();
            if (!size.x || !size.y)
                continue;

            const distance = mousePos.distanceSquared(o.pos);
            if (distance < bestDistance)
            {
                bestDistance = distance;
                bestObject = o
            }

            size.x = max(size.x, .2);
            size.y = max(size.y, .2);

            const color = new Color(
                o.collideTiles?1:0, 
                o.collideSolidObjects?1:0,
                o.isSolid?1:0, 
                o.parent ? .2 : .5);

            // show object info
            drawRect(o.pos, size, color);
            drawRect(o.pos, size.scale(.8), o.parent ? new Color(1,1,1,.5) : new Color(0,0,0,.8));
            o.parent && drawLine(o.pos, o.parent.pos, .1, new Color(0,0,1,.5));
        }
        
        if (bestObject)
        {
            const saveContext = mainContext;
            mainContext = overlayContext
            const raycastHitPos = tileCollisionRaycast(bestObject.pos, mousePos);
            raycastHitPos && drawRect(raycastHitPos.floor().add(vec2(.5)), vec2(1), new Color(0,1,1,.3));
            drawRect(mousePos.floor().add(vec2(.5)), vec2(1), new Color(0,0,1,.5));
            drawLine(mousePos, bestObject.pos, .1, !raycastHitPos ? new Color(0,1,0,.5) : new Color(1,0,0,.5));

            let pos = mousePos.copy(), height = vec2(0,.5);
            const printVec2 = (v)=> '(' + (v.x>0?' ':'') + (v.x).toFixed(2) + ',' + (v.y>0?' ':'')  + (v.y).toFixed(2) + ')';
            const args = [.5, new Color, .05, undefined, undefined, 'monospace'];

            drawText('pos = ' + printVec2(bestObject.pos) 
                + (bestObject.angle>0?'  ':' ') + (bestObject.angle*180/PI).toFixed(1) + '°', 
                pos = pos.add(height), ...args);
            drawText('vel = ' + printVec2(bestObject.velocity), pos = pos.add(height), ...args);
            drawText('size = ' + printVec2(bestObject.size), pos = pos.add(height), ...args);
            drawText('type = ' + ( bestObject.constructor.name), pos = mousePos.subtract(height), ...args);
            drawText('collision = ' + getTileCollisionData(mousePos), pos = mousePos.subtract(height.scale(2)), ...args);
            mainContext = saveContext;
        }

        glCopyToContext(mainContext);
    }

    {
        // render debug rects
        overlayContext.lineWidth = 1;
        const pointSize = debugPointSize * cameraScale;
        debugPrimitives.forEach(p=>
        {
            // create canvas transform from world space to screen space
            const pos = worldToScreen(p.pos);
            
            overlayContext.save();
            overlayContext.lineWidth = 2;
            overlayContext.translate(pos.x|0, pos.y|0);
            overlayContext.rotate(p.angle);
            overlayContext.fillStyle = overlayContext.strokeStyle = p.color;

            if (p.text != undefined)
            {
                overlayContext.font = p.size*cameraScale + 'px '+ p.font;
                overlayContext.textAlign = 'center';
                overlayContext.textBaseline = 'middle';
                overlayContext.fillText(p.text, 0, 0);
            }
            else if (p.size == 0 || p.size.x === 0 && p.size.y === 0 )
            {
                // point
                overlayContext.fillRect(-pointSize/2, -1, pointSize, 3);
                overlayContext.fillRect(-1, -pointSize/2, 3, pointSize);
            }
            else if (p.size.x != undefined)
            {
                // rect
                const w = p.size.x*cameraScale|0, h = p.size.y*cameraScale|0;
                p.fill && overlayContext.fillRect(-w/2|0, -h/2|0, w, h);
                overlayContext.strokeRect(-w/2|0, -h/2|0, w, h);
            }
            else
            {
                // circle
                overlayContext.beginPath();
                overlayContext.arc(0, 0, p.size*cameraScale, 0, 9);
                p.fill && overlayContext.fill();
                overlayContext.stroke();
            }

            overlayContext.restore();
        });

        overlayContext.fillStyle = overlayContext.strokeStyle = '#fff';
    }

    {
        let x = 9, y = -20, h = 30;
        overlayContext.fillStyle = '#fff';
        overlayContext.textAlign = 'left';
        overlayContext.textBaseline = 'top';
        overlayContext.font = '28px monospace';
        overlayContext.shadowColor = '#000';
        overlayContext.shadowBlur = 9;

        if (debugOverlay)
        {
            overlayContext.fillText(engineName, x, y += h);
            overlayContext.fillText('Objects: ' + engineObjects.length, x, y += h);
            overlayContext.fillText('Time: ' + formatTime(time), x, y += h);
            overlayContext.fillText('---------', x, y += h);
            overlayContext.fillStyle = '#f00';
            overlayContext.fillText('~: Debug Overlay', x, y += h);
            overlayContext.fillStyle = debugPhysics ? '#f00' : '#fff';
            overlayContext.fillText('1: Debug Physics', x, y += h);
            overlayContext.fillStyle = debugParticles ? '#f00' : '#fff';
            overlayContext.fillText('2: Debug Particles', x, y += h);
            overlayContext.fillStyle = godMode ? '#f00' : '#fff';
            overlayContext.fillText('3: God Mode', x, y += h);
            overlayContext.fillStyle = '#fff';
            overlayContext.fillText('5: Save Screenshot', x, y += h);
            //overlayContext.fillStyle = debugParticleEditor ? '#f00' : '#fff';
            //overlayContext.fillText('6: Particle Editor', x, y += h);
            overlayContext.fillStyle = debugGamepads ? '#f00' : '#fff';
            overlayContext.fillText('7: Debug Gamepads', x, y += h);

            let keysPressed = '';
            for(const i in inputData[0])
            {
                if (i && keyIsDown(i, 0))
                    keysPressed += i + ' ' ;
            }
            keysPressed && overlayContext.fillText('Keys Down: ' + keysPressed, x, y += h);

            let buttonsPressed = '';
            if (inputData[1])
            for(const i in inputData[1])
            {
                if (i && keyIsDown(i, 1))
                    buttonsPressed += i + ' ' ;
            }
            buttonsPressed && overlayContext.fillText('Gamepad: ' + buttonsPressed, x, y += h);

        }
        else
        {
            overlayContext.fillText(debugPhysics ? 'Debug Physics' : '', x, y += h);
            overlayContext.fillText(debugParticles ? 'Debug Particles' : '', x, y += h);
            overlayContext.fillText(godMode ? 'God Mode' : '', x, y += h);
            overlayContext.fillText(debugGamepads ? 'Debug Gamepads' : '', x, y += h);
        }
    
        overlayContext.shadowBlur = 0;
    }

    debugPrimitives = debugPrimitives.filter(r=>r.time.get()<0);
}

///////////////////////////////////////////////////////////////////////////////
// particle system editor (work in progress)
let debugParticleEditor = 0, debugParticleSystem, debugParticleSystemDiv, particleSystemCode;

const debugToggleParticleEditor = ()=>
{
    debugParticleEditor = !debugParticleEditor;

    if (debugParticleEditor)
    {
        if (!debugParticleSystem || debugParticleSystem.destroyed)
            debugParticleSystem = new ParticleEmitter(cameraPos);
    }
    else if (debugParticleSystem && !debugParticleSystem.destroyed)
        debugParticleSystem.destroy();


    const colorToHex = (color)=>
    {
        const componentToHex = (c)=>
        {
            const hex = (c*255|0).toString(16);
            return hex.length == 1 ? '0' + hex : hex;
        }

        return '#' + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
    }
    const hexToColor = (hex)=>
    {
        return new Color(
            parseInt(hex.substr(1,2), 16)/255,
            parseInt(hex.substr(3,2), 16)/255,
            parseInt(hex.substr(5,2), 16)/255)
    }

    if (!debugParticleSystemDiv)
    {
        const div = debugParticleSystemDiv = document.createElement('div');
        div.innerHTML = '<big><b>Particle Editor';
        div.style = 'position:absolute;top:10;left:10;color:#fff';
        document.body.appendChild(div);

        for ( const setting of debugParticleSettings)
        {
            const input = setting[2] = document.createElement('input');
            const name = setting[0];
            const type = setting[1];
            if (type)
            {
                if (type == 'color')
                {
                    input.type = type;
                    const color = debugParticleSystem[name];
                    input.value = colorToHex(color);
                }
                else if (type == 'alpha' && name == 'colorStartAlpha')
                    input.value = debugParticleSystem.colorStartA.a;
                else if (type == 'alpha' && name == 'colorEndAlpha')
                    input.value = debugParticleSystem.colorEndA.a;
                else if (name == 'tileSizeX')
                    input.value = debugParticleSystem.tileSize.x;
                else if (name == 'tileSizeY')
                    input.value = debugParticleSystem.tileSize.y;
            }
            else
                input.value = debugParticleSystem[name] || '0';

            input.oninput = (e)=>
            {
                const inputFloat = parseFloat(input.value) || 0;
                if (type)
                {
                    if (type == 'color')
                    {
                        const color = hexToColor(input.value);
                        debugParticleSystem[name].r = color.r;
                        debugParticleSystem[name].g = color.g;
                        debugParticleSystem[name].b = color.b;
                    }
                    else if (type == 'alpha' && name == 'colorStartAlpha')
                    {
                        debugParticleSystem.colorStartA.a = clamp(inputFloat);
                        debugParticleSystem.colorStartB.a = clamp(inputFloat);
                    }
                    else if (type == 'alpha' && name == 'colorEndAlpha')
                    {
                        debugParticleSystem.colorEndA.a = clamp(inputFloat);
                        debugParticleSystem.colorEndB.a = clamp(inputFloat);
                    }
                    else if (name == 'tileSizeX')
                    {
                        debugParticleSystem.tileSize = vec2(parseInt(input.value), debugParticleSystem.tileSize.y);
                    }
                    else if (name == 'tileSizeY')
                    {
                        debugParticleSystem.tileSize.y = vec2(debugParticleSystem.tileSize.x, parseInt(input.value));
                    }
                }
                else
                    debugParticleSystem[name] = inputFloat;

                updateCode();
            }
            div.appendChild(document.createElement('br'));
            div.appendChild(input);
            div.appendChild(document.createTextNode(' ' + name));
        }

        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
        div.appendChild(particleSystemCode = document.createElement('input'));
        particleSystemCode.disabled = true;
        div.appendChild(document.createTextNode(' code'));

        div.appendChild(document.createElement('br'));
        const button = document.createElement('button')
        div.appendChild(button);
        button.innerHTML = 'Copy To Clipboard';
        
        button.onclick = (e)=> navigator.clipboard.writeText(particleSystemCode.value); 

        const updateCode = ()=>
        {
            let code = '';
            let count = 0;
            for ( const setting of debugParticleSettings)
            {
                const name = setting[0];
                const type = setting[1];
                let value;
                if (name == 'tileSizeX' || type == 'alpha')
                    continue;

                if (count++)
                    code += ', ';

                if (name == 'tileSizeY')
                {
                    value = `vec2(${debugParticleSystem.tileSize.x},${debugParticleSystem.tileSize.y})`;
                }
                else if (type == 'color')
                {
                    const c = debugParticleSystem[name];
                    value = `new Color(${c.r},${c.g},${c.b},${c.a})`;
                }
                else
                    value = debugParticleSystem[name];
                code += value;
            }

            particleSystemCode.value = '...[' + code + ']';
        }
        updateCode();
    }
    debugParticleSystemDiv.style.display = debugParticleEditor ? '' : 'none'
}

const debugParticleSettings = 
[
    ['emitSize'],
    ['emitTime'],
    ['emitRate'],
    ['emitConeAngle'],
    ['tileIndex'],
    ['tileSizeX', 'tileSize'],
    ['tileSizeY', 'tileSize'],
    ['colorStartA', 'color'],
    ['colorStartB', 'color'],
    ['colorStartAlpha', 'alpha'],
    ['colorEndA',   'color'],
    ['colorEndB',   'color'],
    ['colorEndAlpha', 'alpha'],
    ['particleTime'],
    ['sizeStart'],
    ['sizeEnd'],
    ['speed'],
    ['angleSpeed'],
    ['damping'],
    ['angleDamping'],
    ['gravityScale'],
    ['particleConeAngle'],
    ['fadeRate'],
    ['randomness'],
    ['collideTiles'],
    ['additive'],
    ['randomColorComponents'],
    ['renderOrder'],
];