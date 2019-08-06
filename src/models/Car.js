import { Record, define } from 'type-r'
import React              from 'react-mvx';
import { NeuralModel }    from './Neural';

const WHEEL_STEP = 6;
const SPEED_STEP = .5;
const MAX_SPEED  = 15;

const SONAR_ANGLES    = [ -80, -30, 0, 30, 80 ];
const SONAR_MAX_RANGE = 150;

@define
export class CarModel extends Record {
    static attributes = {
        label        : '',
        speed        : 0,
        direction    : 0,
        wheel        : 0,
        x            : 0,
        y            : 0,
        is_crashed   : false,
        is_picked    : false,
        color        : '',
        sonar        : [],
        sonar_points : [],
        brain        : NeuralModel
    };

    toRight() {
        if( this.speed > 0 ) {

            this.wheel = 1;
//            this.direction += this.wheel;
            /*          this.direction += WHEEL_STEP;

                      if( this.direction > 180 ) {
                          this.direction -= 360;
                      }
          */
            /*
                      this.wheel += WHEEL_STEP;
                      if( this.wheel > MAX_WHEEL ) {
                          this.wheel = MAX_WHEEL;
                      }
             */
        }
    }

    toLeft() {
        if( this.speed > 0 ) {

            this.wheel = -1;

            /*            this.wheel -= WHEEL_STEP;
                        if( this.wheel < -MAX_WHEEL ) {
                            this.wheel = -MAX_WHEEL;
                        }
            */
            /*
                        this.direction -= WHEEL_STEP;

            if( this.direction < -180 ) {
                this.direction += 360;
            }
*/
        }
    }

    forward() {
        this.wheel = 0;
    }

    speedUp() {
        if( this.is_crashed ) {
            return;
        }

        this.speed += SPEED_STEP;
        this.speed = Math.min( this.speed, MAX_SPEED );
    }

    speedDown() {
        this.speed -= SPEED_STEP;
        this.speed = Math.max( this.speed, 0 );
    }

    draw() {
        return <g>
            <path d='M 0 0 L 10 0 L -10 5 L -10 -5 L 10 0 z'
                  stroke={ this.is_crashed ? 'navy' : 'red' }
                  fill='none'
                  transform={
                      'rotate(' + this.direction + ' ' + this.x + ' ' + this.y
                      + ') translate(' + this.x + ' ' + this.y + ')' }/>
            { _.map( this.sonar_points, ( p, i ) =>
                <path key={ i }
                      d={ 'M ' + this.x + ' ' + this.y + ' L ' + p[ 0 ] + ' ' + p[ 1 ] }
                      stroke={ this.is_crashed ? 'none' : 'green' }
                      fill='none'
                /> ) }
        </g>

    }

    move() {
        this.direction += this.wheel * WHEEL_STEP;
        //   this.wheel = 0;

        const rad = this.direction * 2 * Math.PI / 360;
        this.y += Math.sin( rad ) * this.speed;
        this.x += Math.cos( rad ) * this.speed;
    }

    sonar_scan( track ) {
        const { x, y } = this;

        _.each( SONAR_ANGLES, ( ang, indx ) => {
            const [ px, py ] = track.scan_border_point( this.x, this.y, this.direction + ang );

            this.sonar[ indx ]        = Math.sqrt( (px - x) * (px - x) + (py - y) * (py - y) );
            this.sonar_points[ indx ] = [ px, py ];
        } )
    }

    crash() {
        this.speed      = 0;
        this.is_crashed = true;

        console.log( this.label + ' is crashed' );
    }

    checkRoad( track ) {
        if( !track.is_road( this.x, this.y ) ) {
            this.crash();
        }
    }

    init_brain() {
        this.brain.create( [ 7, 11, 2 ] );
        this.brain.seed( null, 1 );
    }

    do_think() {

        const vector = _.map( this.sonar, s => Math.min( SONAR_MAX_RANGE, s ) / SONAR_MAX_RANGE );
        vector.push( (this.wheel + 1) / 2 );
        vector.push( this.speed / MAX_SPEED );

        this.brain.input( vector );

        const res = this.brain.calculate();

        console.log( res );

        this.speed = res[ 0 ] * MAX_SPEED;
        this.wheel = res[ 1 ] * 2 - 1;
    }
}