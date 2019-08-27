import { Record, define, type } from 'type-r'

@define
export class TrackModel extends Record {
    static attributes = {
        filename : '',
        width    : 800,
        height   : 600,
        sx       : 0,
        sy       : 0,
        sd       : 0,
        ctx      : type( Object ).value( null ).has.toJSON( false )
    };

    attachTo( canvas ) {
        return new Promise( ( resolve ) => {
            const img = new Image();

            img.crossOrigin = 'Anonymous';
            canvas.height   = this.height;
            canvas.width    = this.width;
            this.ctx        = canvas.getContext( '2d' );

            img.addEventListener( 'load', () => {
                this.ctx.drawImage( img, 0, 0 );
                resolve();
            }, false );

            img.src = this.filename;
        } );
    }

    scan_border_point( sx, sy, direction ) {
        let rad = direction * 2 * Math.PI / 360,
            p   = 20,
            dy  = Math.sin( rad ),
            dx  = Math.cos( rad ),
            x   = sx,
            y   = sy;

        while( p > 2 ) {
            if( this.is_road( x + dx * p, y + dy * p ) ) {
                x += dx * p;
                y += dy * p;
            } else {
                p /= 2;
            }
        }

        return [ x + dx * (p / 2), y + dy * (p / 2) ];
    }

    /*
        pixel( x, y, r, g, b ) {
            const idt = this.ctx.createImageData( 1, 1 ),
                  dt  = idt.data;

            dt[ 0 ] = r;
            dt[ 1 ] = g;
            dt[ 2 ] = b;

            this.ctx.putImageData( idt, x, y );
        }
    */

    is_road( x, y ) {
        const d = this.ctx.getImageData( x, y, 1, 1 ).data;

        return d[ 0 ] + d[ 1 ] + d[ 2 ] > 200;
    }
}