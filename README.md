# ![LittleJS Logo](favicon.png) LittleJS - The Tiny JavaScript Game Engine That Can

## All aboard!

LittleJS is a super lightweight JavaScript game engine with a fast hybrid rendering system. It provides everything necessary to make amazing games, including rendering, physics, particles, sound effects, music, input handling, and debug tools. LittleJS is designed to be extremely small yet powerful enough for a variety of applications, from game jams to commercial releases. The code is very well documented with a variety of examples to get you started. Choo-Choo! 🚂

## [LittleJS Documentation](https://killedbyapixel.github.io/LittleJS/docs) - [LittleJS Trailer](https://youtu.be/chuBzGjv7Ms) - [LittleJS Trello](https://trello.com/b/E9zf1Xak/littlejs)

![LittleJS Screenshot](examples/screenshot.jpg)

## Example Projects

### [Hello World](https://killedbyapixel.github.io/LittleJS/) - Clean project with only a few things to get you started
### [Puzzle Game](https://killedbyapixel.github.io/LittleJS/examples/puzzle) - Match 3 puzzle game with HD rendering and high score tracking
### [Platformer](https://killedbyapixel.github.io/LittleJS/examples/platformer) - Platformer/shooter with procedural generation and destruction
### [Breakout](https://killedbyapixel.github.io/LittleJS/examples/breakout) - Breakout game with mouse/touch or gamepad control
### [Stress Test](https://killedbyapixel.github.io/LittleJS/examples/stress) - Max sprite/object test and music system demo

## Features

- Very small footprint with no dependencies
- Can render 10,000+ objects at 60fps, often many times more
- Object oriented system with base class engine object
- Fast 2D physics and collision handling for axis aligned boxes
- Positional audio effects with [zzfx](https://killedbyapixel.github.io/ZzFX/) and music with [zzfxm](https://keithclark.github.io/ZzFXM/), mp3s, or wavs
- Input processing system with keyboard, mouse, gamepad, and touch support
- Engine helper functions and classes like Vector2, Color, and Timer
- Tile layer cached rendering and collision system for level data
- Particle effects system (particle editor/designer in progress)
- Medal system tracks and displays achievements with Newgrounds and OS13k integration
- Several easy to understand example projects you can build on
- All example projects are compatible with mobile devices
- Debug tools and debug rendering system
- [Full documentation](https://killedbyapixel.github.io/LittleJS/docs) automatically generated from the source code block tags with [JSDoc](https://github.com/jsdoc/jsdoc)
- Build system automatically combines everything, minifies, and removes unused code
- For size coding competitions like [js13kGames](https://js13kgames.com/), starter project builds to a 7KB zip with [Roadroller](https://github.com/lifthrasiir/roadroller)
- Easily build a Windows executable with [electron](https://www.electronjs.org/) for distribution on platforms like Steam
- Open Source with the [MIT license](https://github.com/KilledByAPixel/LittleJS/blob/main/LICENSE) so it can be used to make commercial games

## Builds

To easily include LittleJS in your game, you can use one of the 3 pre-built js files. These are also built automatically by the build scripts..

- [engine.all.js](https://github.com/KilledByAPixel/LittleJS/blob/main/engine/engine.all.js) - The full game engine with debug mode available
- [engine.all.release.js](https://github.com/KilledByAPixel/LittleJS/blob/main/engine/engine.all.release.js) - The engine optimized for release builds
- [engine.all.min.js](https://github.com/KilledByAPixel/LittleJS/blob/main/engine/engine.all.min.js) - The engine in release mode and minified

The hello world example includes a batch file [build.bat](https://github.com/KilledByAPixel/LittleJS/blob/main/build.bat) that compresses everything into a tiny zip file using Google Closure, UglifyJS, Roadroller, and ECT.

## Games Made With LittleJS

- [Space Huggers](https://github.com/KilledByAPixel/SpaceHuggers) - A more developed version of the platformer example
- Send me your games!

![LittleJS Logo](favicon.png)
