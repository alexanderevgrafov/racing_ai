import { Record, define, type } from 'type-r'

@define
export class NeuralModel extends Record {
    static attributes = {
        bias         : [],
        links        : [],
        data         : type( Array ).has.toJSON( false ),
        inputs_count : 0,
        layers_count : type( Number ).has.toJSON( false )
    };

    create( layers ) {
        this.inputs_count = layers[ 0 ];
        this.layers_count = layers.length;
        _.each( layers, ( num, i ) => {
            this.data[ i ] = new Array( num );
            if( i ) {
                this.bias[ i - 1 ]  = new Array( num );
                this.links[ i - 1 ] = _.map( _.range( 0, num ), () => new Array( layers[ i - 1 ] ) )
            }
        } );
    }

    setAverage( models ) {
        if( !_.isArray( models ) || !models.length ) {
            return;
        }

        const avg = { bias : [], links : [], inputs_count : models[ 0 ].inputs_count };

        _.each( models, m => {
            _.each( m.bias, ( vals, lay ) => {
                !avg.bias[ lay ] && (avg.bias[ lay ] = []);
                !avg.links[ lay ] && (avg.links[ lay ] = []);

                _.each( vals, ( val, i ) => {
                    avg.bias[ lay ][ i ] = (avg.bias[ lay ][ i ] || 0) + val;
                    !avg.links[ lay ][ i ] && (avg.links[ lay ][ i ] = []);

                    _.each( m.links[ lay ][ i ],
                        ( snp, n ) => avg.links[ lay ][ i ][ n ] = (avg.links[ lay ][ i ][ n ] || 0) + snp );
                } )
            } );
        } );

        _.each( avg.bias, ( vals, lay ) => {
            _.each( vals, ( val, i ) => {
                avg.bias[ lay ][ i ] /= models.length;
                _.each( avg.links[ lay ][ i ], ( snp, n ) => avg.links[ lay ][ i ][ n ] /= models.length );
            } )
        } );

        this.set( avg, { parse : true } );
    }

    seed( data = null, variation = 0 ) {
        _.each( this.bias, ( n, l ) => {
            _.each( n, ( v, i ) => {
                n[ i ] =
                    (data ? data.bias[ l ][ i ] : 0) + (2 * Math.random() - 1) * (Math.random() < game_config.freaks_possibility/100 ? 1 : variation);
                _.each( this.links[ l ][ i ],
                    ( v, n ) => this.links[ l ][ i ][ n ] =
                        (data ? data.links[ l ][ i ][ n ] : 0) + (2 * Math.random() - 1) *
                        (Math.random() < game_config.freaks_possibility/100 ? 1 : variation) );
            } );
        } );
    }

    input( vector ) {
        if( vector.length !== this.inputs_count ) {
            throw Error( 'Input vector is not fit' );
        }
        this.data[ 0 ] = vector;
    }

    calculate() {
        _.each( this.bias, ( layer_neurons, lay ) => {
            _.each( layer_neurons, ( neuron, i ) => {
                let res = neuron; // bias!;

                _.each( this.links[ lay ][ i ],
                    ( snp, n ) => {
                        res += snp * this.data[ lay ][ n ];
                        if( Number.isNaN( res ) ) {
                            console.error( 'root' );
                        }

                    } );

                //activation
                let res1 = 1 / (1 + Math.exp( -res ));

                if( Number.isNaN( res1 ) ) {
                    console.error( 'root' );
                }

                this.data[ lay + 1 ][ i ] = res1;
            } )
        } );

        return this.data[ this.layers_count - 1 ];
    }
}