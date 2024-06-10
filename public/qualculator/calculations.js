const BrickType = {
    HALF: 'HALF' ,
    ONE:    'ONE',
    ONE_AND_HALF: 'ONE_AND_HALF' ,
    TWO:  'TWO'  ,
    TWO_AND_HALF: 'TWO_AND_HALF' 
}

function getWallArea(length, width, height){
    return 2 * (length + width) * height;
}

function briksQuantity( length, width, height, brickType){
    const wallArea = getWallArea( length, width, height);
    
    switch(brickType){
        case BrickType.HALF:
            return 75 * wallArea;
        case BrickType.ONE:
            return 150 * wallArea;
        case BrickType.ONE_AND_HALF:
            return 225 * wallArea;
        case BrickType.TWO:
            return 300 * wallArea;
        case BrickType.TWO_AND_HALF:
            return 375 * wallArea;
    }
    
    return Error('Brick type not recognized') ;

}


function sandQuantity(length, width, height, brickType){
    const wallArea = getWallArea( length, width, height);
    switch(brickType){
        case BrickType.HALF:
            return 0.045 * wallArea;
        case BrickType.ONE:
            return 0.08 * wallArea;
        case BrickType.ONE_AND_HALF:
            return 0.13 * wallArea;
        case BrickType.TWO:
            return 0.16 * wallArea;
        case BrickType.TWO_AND_HALF:
            return 0.2 * wallArea;
    }
    
    return Error('Brick type not recognized') ;
}

function cementQuantity(length, width, height, brickType){
    const wallArea = getWallArea( length, width, height);
    switch(brickType){
        case BrickType.HALF:
            return 9 * wallArea;
        case BrickType.ONE:
            return 16 * wallArea;
        case BrickType.ONE_AND_HALF:
            return 26 * wallArea;
        case BrickType.TWO:
            return 32 * wallArea;
        case BrickType.TWO_AND_HALF:
            return 40 * wallArea;
    }
    
    return Error('Brick type not recognized') ;
}
