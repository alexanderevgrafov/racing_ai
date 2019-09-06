import { define, Record } from 'type-r';

export const Tracks_options = {
    '#1':{
        filename : 'tracks/001.png',
        sx: 350,
        sy:320
    },
    '#2':{
        filename : 'tracks/002.png',
        sx: 300,
        sy: 90
    },
    '#3':{
        filename : 'tracks/003.png',
        sx: 250,
        sy: 40
    },
    '#1-back':{
        filename : 'tracks/001.png',
        sx: 350,
        sy:320,
        sd:180
    },
    '#2-back':{
        filename : 'tracks/002.png',
        sx: 300,
        sy: 90,
        sd:180
    },
    '#3-back':{
        filename : 'tracks/003.png',
        sx: 250,
        sy: 40,
        sd:180
    }
};

@define
export class ConfigModel extends Record {
    static attributes = {
        freaks_possibility:5,
        mutation_variation:5,
        track_name:'#1'
    }
}
