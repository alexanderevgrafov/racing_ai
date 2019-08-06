import { Record, define } from 'type-r'

@define
export class TrackModel extends Record {
    static attributes = {
        filename : 'tracks/001.png',
        width    : 800,
        height   : 600,
        ctx      : null
    };

    attachTo( box_element ) {

        return new Promise( ( resolve, reject ) => {
            const canvas = document.createElement( 'canvas' ),
                  img    = new Image();

            img.crossOrigin = 'Anonymous';
            canvas.height   = this.height;
            canvas.width    = this.width;
            this.ctx        = canvas.getContext( '2d' );

            img.addEventListener( 'load', () => {
                this.ctx.drawImage( img, 0, 0 )
                resolve();
            }, false );

            img.src = 'tracks/001.png';

            box_element.appendChild( canvas );
        } );
    }

    scan_border_point( sx, sy, direction ) {
        let rad = direction * 2 * Math.PI / 360,
            dy  = Math.sin( rad ) * 100,
            dx  = Math.cos( rad ) * 100,
            cx  = Math.abs( dx / 2 ),
            cy  = Math.abs( dy / 2 ),
            x   = sx,
            y   = sy;

        while( x > 0 && y > 0 && x < this.width && y < this.height && this.is_road( x, y ) ) {
            do {
                cx += Math.abs( dy );
                x += dx > 0 ? 1 : -1;
//                this.pixel( x, y, 155, 0, 100 );
            }
            while( cx < Math.abs( dx ) && this.is_road( x, y ) );

            cx -= Math.abs( dx );

            do {
                cy += Math.abs( dx );
                y += dy > 0 ? 1 : -1;
//                this.pixel( x, y, 0, 155, 0 );
            } while( cy < Math.abs( dy ) && this.is_road( x, y ) );

            cy -= Math.abs( dy );
        }

        return [ x, y ];
    }

    pixel( x, y, r, g, b ) {
        const idt = this.ctx.createImageData( 1, 1 ),
              dt  = idt.data;

        dt[ 0 ] = r;
        dt[ 1 ] = g;
        dt[ 2 ] = b;

        this.ctx.putImageData( idt, x, y );
    }

    is_road( x, y ) {
        const d = this.ctx.getImageData( x, y, 1, 1 ).data;

        return d[ 0 ] + d[ 1 ] + d[ 2 ] > 200;
    }
}