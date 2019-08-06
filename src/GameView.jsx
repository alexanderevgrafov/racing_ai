import React, { Link }          from 'react-mvx'
import { Record, define, type } from 'type-r'
import { GameModel }            from './models/Game';

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
            { game.car.draw() }
        </svg>
    }
}

@define
export class GameView extends React.Component {
    static state = {
        game : GameModel
    };

    interval = null;

    componentDidMount() {
        $( window ).on( 'keydown', this.onKeyDown );
        $( window ).on( 'keyup', this.onKeyUp );

        this.state.game.track.attachTo( this.refs.canvas ).then(()=>{
            this.interval = setInterval( this.state.game.cycle, 50 );
        });

    }

    componentWillUnmount() {
        $( window ).off( 'keydown', this.onKeyDown );
        $( window ).off( 'keyup', this.onKeyUp );

        clearInterval( this.interval )
    }

    onKeyDown = e => {
        const { game } = this.state;

        switch( e.keyCode ) {
            case 37: //left arrow	37
            case 39: //right arrow	39
                game.car.wheel = 0;
                break;
            case 38: //    up arrow	38
                game.car.speedUp();
                break;
/*            case 39: //right arrow	39
                game.car.toRight();
                break;*/
            case 40: //down arrow	40
                game.car.speedDown();
                break;
        }
    };

    onKeyUp = e => {
        const { game } = this.state;

        switch( e.keyCode ) {
            case 37: //left arrow	37
            case 39: //right arrow	39
                game.car.forward();
                break;
        }
    };

    onMouseMove = e => {
        const {offsetLeft } = this.refs.controller;
        this.state.game.car.wheel = (e.clientX - offsetLeft - CONTROL_WIDTH/2)*2/CONTROL_WIDTH;
    };

    onAction = ()=>{
        this.state.game.car.sonar_scan(this.state.game.track);
    }

    render() {
        const { game } = this.state,
              { car } = game;

        return <div className='af'>
            <Svg game={ game }/>
            <div ref='canvas'/>
            <div className='controller' ref='controller'
            style={{ width:CONTROL_WIDTH }}
                 onMouseMove={ this.onMouseMove }/>
                 <div className='car_report'>
                     Speed: {car.speed}<br/>
                     Wheel: {Math.round(car.wheel*10)/10}<br/>
                     Direction: {Math.round(car.direction)}<br/>
                     { Math.round(car.x) } x { Math.round(car.y) }<br/>
                     Vector: { car.sonar.join(', ')}<br/>
                 </div>
            <button onClick={ this.onAction}>Action</button>
        </div>
    }
}