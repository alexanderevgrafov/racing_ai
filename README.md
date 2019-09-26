# Racing AI. Machine learning sandbox

## About
 This is very basic demonstration of machine learning on React - no any ML library is used.
 
 Yet to be commented for public.  
 
## A bit of explanation
The idea was to create autopilot neural network which drives cars on random drawn track.
So you have N(==20) cars on the track - each car have own "brain" which drives it.
You can pick one (or more) cars to restart process, with new cars generation created with NN weights as average of previously picked ones, + some randomness.
So, picking most successful cars you can train your model to navigate through the track (no more than 10 mins of pick-and-restart cycles).

**This is fun!** 

Track is just black-and-white PNG with starting (x,y) point and initial (degree) direction. (see /src/config.js) 
 
Car model is pretty basic - just wheel angle & throttle/break  parameters which used to calculate next position.

Car crashes by touching road boundary.  

Also car has 5 "radars" to evaluate distances to the edge of track.

## Neural Network details  
Neural Network has 7+11+2 nodes

**Inputs are:**
- 5 "lidar" vectors (you can pick any moving vehicle to see "lidar lines") 
  - forward, 
  - +/-30deg 
  - +/-80deg
- current speed
- current direction

**Outputs are:**
- Throttle
- Wheel direction

Throttle is to increase-decrease speed, wheel direction is to change direction of a car, obviously.

## How to train your model

On very beginning your model is totally random, so vehicles goes fast and never try to turn. 

This no backpropagation implemented - **you just manually pick any successful competitors and restart** - new model will be populated 
with average data from picked cars.          

First dozen of restarts may be boring as we do totally random search for just a glimpse of  
