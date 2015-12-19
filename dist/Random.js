/**
 * Created by gal on 12/19/2015.
 */
module.exports = {

    randomBetween : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomArrayMember: function(arrayToSelectFrom){
        var randomIndex = this.randomBetween(0, arrayToSelectFrom.length);
        return arrayToSelectFrom[randomIndex];
    },
    removeRandomArrayMember: function(arrayToSelectFrom){
        var randomIndex = this.randomBetween(0, arrayToSelectFrom.length);
        var removedItem = arrayToSelectFrom.splice(randomIndex,1);
        return {arr: arrayToSelectFrom, item:removedItem};
    }
};