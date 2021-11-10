# wot-web-simulator
A prototype for a simulation framework for the Web of Things.

A fixed tick simulation runs on a node.js server that exposes thing descriptions and implements the affordances API of the simulated things available in an environment and emits events through a websocket in order to realize an "real-time" updated visualization on a web-app.

Comes with a default simulation environment with smart RGB lamps.

This framework aims to:
- offer a simulation environment to test applications that needs to operate over web-things.
- be easily configurable to support different scenarios with multiple things
- display an intuitive graphic interface to debug the observe the behaviour of the system
- offer the possibility for customization for a better graphic representation of the things
- have a robust infrastructure that allow to only add the simulation models and the thing descriptions to actually simulate a new thing


Major work should be done in the future in order to simplify the work to actually add things.
