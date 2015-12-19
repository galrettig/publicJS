/**
 * Created by gal on 12/19/2015.
 */

var randoms = require('./Random.js');
var Strings = {

    // generates random String in a random length from a given array of words
    mixWords : function(arrayOfWords){
        var stringLength = randoms.randomBetween(1, arrayOfWords.length);
        var strToBuild = "";
        var tempArrAndMember = {};
        tempArrAndMember.arr = arrayOfWords;

        for(var i = 0; i < stringLength; i++){
            //TODO: deep clone given array
            tempArrAndMember = randoms.removeRandomArrayMember(tempArrAndMember.arr);
            var randomElement = tempArrAndMember.item[0];
            if(typeof randomElement === "string"){
                strToBuild += i + 1 === stringLength ? randomElement : randomElement + " ";
            }
        }
        return strToBuild;
    }
};
module.exports = Strings;