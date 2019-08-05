import React, { Link }          from 'react-mvx'
import * as ReactDOM            from 'react-dom'
import { Record, define, type } from 'type-r'
import { Container }            from './Bootstrap'
import './app.scss'

@define
class Application extends React.Component {
    static state = {};

    render() {
        return <Container>
            <h1>ML sandbox</h1>
        </Container>;
    }
}

ReactDOM.render( React.createElement( Application, {} ), document.getElementById( 'app-mount-root' ) );