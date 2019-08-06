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
            if (!car.is_crashed) {
                car.move();
                car.sonar_scan(this.track);
                car.checkRoad( this.track );
            }
        } );
    };

    initialize() {
        this.cars.push( new CarModel( { x : 350, y : 320, direction : 0, label:'Red01' } ) );
    }
}