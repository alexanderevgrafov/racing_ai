# Racing AI. Machine learning sandbox

##About
 This is very basic demonstration of machine learning on React - no any ML library is used.
 
 Yet to be commented for public.  
 
## A bit of explanation
The idea was to create autopilot neural network which drives cars on random drawn track.
So you have N(==20) cars on the track - each car have own "brain" which drives it up to crash into track edge.
You can select cars and restart the race with new cars, with brains initiated with average data of previously selected ones, + some randomness.
So, selecting most successful cars you can easly (in dozen of generations) train your cars to navigate through the track. 

Track is just black-and-white PNG with starting point and initial direction. (see /src/config.js) 
 
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

##How to train your model

On very beginning your model is totally random, so vehicles goes fast and never try to turn. 

This no backpropagation implemented - **you just manually pick any successful competitors and restart** - new model will be populated 
with average data from picked cars.          

First dozen of restarts may be boring as we do totally random search for just a glimpse of  
