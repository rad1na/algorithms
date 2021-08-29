export const getPriorityColor = priority => {
    switch(priority){
        case 3:
            return '#429ef5';
        case 2:
            return '#f5d442';
        case 1:
            return '#f55442';
        default: 
            return '#429ef5'
    }
}