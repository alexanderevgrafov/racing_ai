import React, { Link }                                 from 'react-mvx'
import { Record, define, type }                        from 'type-r'
import { GameModel }                                   from './models/Game';
import { NeuralModel }                                 from './models/Neural';
import { Form, ToggleButtonGroupLinked, ToggleButton } from './Bootstrap';
import { Tracks_options }                              from './models/config';
import { TrackModel }                                  from './models/Track';

const CONTROL_WIDTH = 100;

@define
export class Svg extends React.Component {
    static props = {
        game : GameModel
    };

    render() {
        const { game } = this.props;

        return <svg width={ game.track.width } height={ game.track.height } xmlns='http://www.w3.org/2000/svg'
                    viewBox={ '0 0 ' + game.track.width + ' ' + game.track.height }
                    preserveAspectRatio='xMidYMid'
                    style={ { position : 'absolute' } }
        >
            { game.cars.map( car => car.draw() ) }
        </svg>
    }
}

@define
export class GameView extends React.Component {
    static state = {
        game : GameModel
    };

    interval = null;

    componentWillMount() {
        const { game } = this.state;

        try {
            game.config.set( JSON.parse( localStorage.getItem( 'config' ) ), { parse : true } );
        }
        catch( e ) {
            console.error( 'No config found in the LS' )
        }

        window.game_config = game.config;
    }

    componentDidMount() {
        const { game } = this.state;

        this.listenTo( game.config, 'change', () => {
            localStorage.setItem( 'config', JSON.stringify( game.config.toJSON() ) );
        } );

        this.listenTo( game.config, 'change:track_name', () => {
            this.doChangeTrack();
        } );

        this.doChangeTrack();
    }

    componentWillUnmount() {
        clearInterval( this.interval )
    }

    doChangeTrack() {
        const { game } = this.state;

        game.track = new TrackModel( Tracks_options[ game.config.track_name ] );

        return game.track.attachTo( this.refs.canvas ).then( () => {
                game.init( localStorage.getItem( 'best_brain' ) );
                this.doPause( false )
            }
        )
    }

    onAction = () => {
        const { game } = this.state,
              picked   = game.cars.filter( car => car.is_picked );

        if( picked.length ) {
            if( !game.avg_brain ) {
                game.avg_brain = new NeuralModel();
            }

            game.avg_brain.setAverage( _.map( picked, x => x.brain ) );

            localStorage.setItem( 'best_brain', JSON.stringify( game.avg_brain.toJSON() ) );
        }

        game.init();
        this.doPause( false );
    };

    onBrainReset = () => {
        this.state.game.avg_brain = null;
    };

    doPause( _force = null ) {
        const { game } = this.state;

        if( game.paused = _.isNull( _force ) ? !game.paused : _force ) {
            this.interval && clearInterval( this.interval );
            this.interval = null;
        } else if( !this.interval ) {

            this.interval = setInterval( game.cycle, 20 );
        }
    }

    render() {
        const { game } = this.state,
              { car }  = game;

        return <div className='af'>
            <Svg game={ game }/>
            <div>
                <canvas ref='canvas'/>
            </div>
            <div className='controller' ref='controller'
                 style={ { width : CONTROL_WIDTH } }
                 onMouseMove={ this.onMouseMove }/>
            { car &&
              <div className='car_report'>
                  Speed: { car.speed }<br/>
                  Wheel: { Math.round( car.wheel * 10 ) / 10 }<br/>
                  Direction: { Math.round( car.direction ) }<br/>
                  { Math.round( car.x ) } x { Math.round( car.y ) }<br/>
                  Vector: { car.sonar.join( ', ' ) }<br/>
              </div>
            }
            <div className='brains_list'>
                {/*
                {
                    game.cars.map( car =>
                        !car.is_picked ? null :
                        <div className='brain'>
                            <h4>{ car.label }</h4>
                            { JSON.stringify( car.brain.toJSON() ) }
                        </div> )
                }
*/ }
                { game.avg_brain &&
                  <div className='brain'>
                      <h4>Average Brain</h4>
                      { JSON.stringify( game.avg_brain.toJSON() ) }
                  </div>
                }

            </div>
            <button onClick={ this.onAction }>Restart with picked</button>
            <button onClick={ this.onBrainReset }>Reset game results</button>
            <button onClick={ () => this.doPause() }>{ game.paused ? 'Resume' : 'Pause' }</button>
            <Form.ControlLinked valueLink={ game_config.linkAt( 'freaks_possibility' ) }/>
            <Form.ControlLinked valueLink={ game_config.linkAt( 'mutation_variation' ) }/>
            <ToggleButtonGroupLinked type='radio' valueLink={ game_config.linkAt( 'track_name' ) } name='track_name'>
                {
                    _.map( _.keys( Tracks_options ),
                        name => <ToggleButton value={ name } key={ name }>{ name }</ToggleButton> )
                }
            </ToggleButtonGroupLinked>

        </div>
    }
}