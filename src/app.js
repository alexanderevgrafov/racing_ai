import React, { define } from 'react-mvx'
import * as ReactDOM     from 'react-dom'
import { GameView }      from './GameView';
import { Container }     from './Bootstrap'
import './app.scss'

@define
class Application extends React.Component {
    static state = {};

    render() {
        return <Container>
            <GameView/>
        </Container>;
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );