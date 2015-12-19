/**
 * Created by gal on 12/19/2015.
 */

var randoms = require('./Random');
module.exports = {

    // generates random String in a random length from a given array of words
    mixWords : function(arrayOfWords){
        var stringLength = randoms.randomBetween(0, arrayOfWords.length - 1);
        var strToBuild = "";

        var tempArrAndMember = {};
        tempArrAndMember.arr = arrayOfWords;

        for(var i = 0; i < stringLength.length; i++){
            //TODO: deep clone given array
            tempArrAndMember = randoms.removeRandomArrayMember(tempArrAndMember.arr);
            var randomElement = tempArrAndMember.item;

            if(typeof randomElement === "String"){
                strToBuild += randomElement;
            }
        }
    }
};