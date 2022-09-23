/**
 * This method performs a comparison between arrays to see if they are identical or not.
 * @param {array} firstArray first array to compare
 * @param {array} secondArray second array to compare
 * @returns {boolean} if both arrays are equal returns true else return false
 */
export function compareArrays(firstArray, secondArray) {
    let equalArrays = firstArray.length === secondArray.length;
    //If arrays are of the same size we compare them
    if(equalArrays){
        for (let i = 0; i < firstArray.length && equalArrays; i++) {
            if(!(firstArray[i].toString() === secondArray[i].toString())){
                equalArrays = false;
            }
        }
    }

    return equalArrays;
}

/*
    Search if an Array of arrays contains a new array
*/
export function containsArray(generalArray, newArray){
    let contains = false;
    for(let i = 0; i < generalArray.length && !contains; i++){
        contains = contains || (generalArray[i].toString() === newArray.toString());
    }

    return contains;
}