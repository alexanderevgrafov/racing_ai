import { Record, define, type } from 'type-r'
import { TrackModel }           from './Track';
import { CarModel }             from './Car';

@define
export class GameModel extends Record {
    static attributes = {
        track  : TrackModel,
        cars   : CarModel.Collection,
        ticker : 0
    };

    get car() {
        return this.cars.at( 0 );
    }

    cycle = () => {
        this.ticker++;
        this.cars.each( car => {
            if( !car.is_crashed ) {
                car.sonar_scan( this.track );
                car.do_think();
                car.move();
                car.checkRoad( this.track );
            }
        } );
    };

    initialize() {
        this.cars.push( new CarModel() );
    }

    init() {
        this.car.set( { x : 350, y : 320, direction : 0, speed : 0, wheel : 0, label : 'Red01', is_crashed : false } );
        this.car.init_brain();
    }
}