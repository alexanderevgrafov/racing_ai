import { Record, define, type } from 'type-r'
import { TrackModel }           from './Track';
import { CarModel }             from './Car';
import { NeuralModel }          from './Neural';
import { ConfigModel }          from './config';

const CARS_PER_GENERATION = 20,
      STARTING_RADIUS     = 20;

@define
export class GameModel extends Record {
    static attributes = {
        track     : TrackModel,
        config    : ConfigModel,
        cars      : CarModel.Collection,
        avg_brain : type( NeuralModel ).value( null ), // null is significant for initial start
        paused    : false,
        ticker    : 0
    };

    cycle = () => {
        this.ticker++;
        this.transaction( () => {

            this.cars.each( car => {
                if( !car.is_crashed ) {
                    car.sonar_scan( this.track );
                    car.do_think();
                    car.move();
                    car.checkRoad( this.track );
                }
            } );
        } );
    };

    init( brain = null ) {
        if( brain ) {
            try {
                this.avg_brain = new NeuralModel( JSON.parse( brain ) );
            }
            catch( e ) {
                console.log( 'Bad model loaded from LS' )
            }
        }

        this.cars.reset();

        for( let i = 0; i < CARS_PER_GENERATION; i++ ) {
            const car = new CarModel(
                {
                    x          : this.track.sx - STARTING_RADIUS / 2 + Math.random() * STARTING_RADIUS,
                    y          : this.track.sy - STARTING_RADIUS / 2 + Math.random() * STARTING_RADIUS,
                    direction  : this.track.sd,
                    label      : 'Red_' + i
                } );

            car.init_brain( this.avg_brain );
            this.cars.add( car );
        }
    }
}