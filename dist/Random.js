/**
 * Created by gal on 12/19/2015.
 */
var Random = {

    /**
     * @description generates a random number between min to max
     * @param min
     * @param max
     * @returns {*}
     */
    randomBetween : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     *
     * @param arrayToSelectFrom
     * @returns {*}
     */
    randomArrayMember: function(arrayToSelectFrom){
        var randomIndex = this.randomBetween(0, arrayToSelectFrom.length);
        return arrayToSelectFrom[randomIndex];
    },
    /**
     *
     * @param arrayToSelectFrom
     * @returns {{arr: splicedArray, item: Array.<T>}}
     */
    removeRandomArrayMember: function(arrayToSelectFrom){
        var randomIndex = this.randomBetween(0, arrayToSelectFrom.length);
        var removedItem = arrayToSelectFrom.splice(randomIndex,1);
        return {arr: arrayToSelectFrom, item:removedItem};
    }
};
module.exports = Random;