import { Record, define, type } from 'type-r'

@define
export class NeuralModel extends Record {
    static attributes = {
        bias         : [],
        links        : [],
        data         : type( Array ).has.toJSON( false ),
        inputs_count : 0,
        layers_count : 0
    };

    create( layers ) {
        this.inputs_count = layers[ 0 ];
        this.layers_count = layers.length;
        _.each( layers, ( num, i ) => {
            this.bias[ i ] = new Array( num );
            this.data[ i ] = new Array( num );
            if( i ) {
                this.links[ i ] = _.map( _.range( 0, num ), () => new Array( layers[ i - 1 ] ) )
            }
        } );
    }

    seed( data = null, variation = 0 ) {
        _.each( this.bias, ( n, l ) => {
            l && _.each( n, ( v, i ) => {
                n[ i ] = (data ? data.bias[ i ] : 0) + (2 * Math.random() - 1) * variation;
                _.each( this.links[ l ][ i ],
                    ( v, n ) => this.links[ l ][ i ][ n ] =
                        (data ? data.links[ l ][ i ][ n ] : 0) + (2 * Math.random() - 1) * variation );
            } );
        } );
    }

    input( vector ) {
        if ( vector.length !== this.inputs_count) {
            throw Error('Input vector is not fit');
        }
        this.data[ 0 ] = vector;
    }

    calculate() {
        _.each( this.bias, ( layer_neurons, lay ) => {
            lay && _.each( layer_neurons, ( neuron, i ) => {
                let res = neuron; // bias!;

                _.each( this.links[ lay ][ i ],
                    ( snp, n ) => {
                        res += snp * this.data[ lay - 1 ][ n ];
                        if( Number.isNaN( res ) ) {
                            console.error('root');
                        }

                    } );

                //activation
                let res1 = 1 / (1 + Math.exp( -res ));

                if( Number.isNaN( res1 ) ) {
                    console.error('root');
                }

                this.data[ lay ][ i ] = res1;
            } )
        } );

        return this.data[ this.layers_count - 1 ];
    }
}