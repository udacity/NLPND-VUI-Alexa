'use strict'
var expect = require('chai').expect;
var assert = require('chai').assert;
var index = require('../lambda/index');
var events = require('./events');
var resultArr = [];
var utils = require('./utils');
var fs = require("fs");
var schema = JSON.parse(fs.readFileSync('./models/en-US.json', 'utf-8'));

var intents = schema.interactionModel.languageModel.intents;
var yearsArr = [];

var reqWithYear = events.GetNewYearFactIntent;
if (yearsArr.length > 0) {
    reqWithYear = events.GetNewYearFactIntent2; // deep copy of GetNewYearFactIntent
    reqWithYear.request.intent.slots.FACT_YEAR.value = yearsArr[0];
};
// https://www.thepolyglotdeveloper.com/2016/08/test-amazon-alexa-skills-offline-with-mocha-and-chai-for-node-js/
const context = require('aws-lambda-mock-context');
const ctx1 = context();
const ctx2 = context();
const ctx3 = context();
const ctx4 = context();

describe("Test Part 2", function () {

  var yearFactIntent = schema.interactionModel.languageModel.intents.find(function(element){
    return element.name == 'GetNewYearFactIntent'
  });



    describe("Testing declaration of GetNewYearFactIntent intent", function () {


      it('should have GetNewYearFactIntent declared', function () {

        expect(yearFactIntent).to.be.an('object');
      })
    })

    describe("Testing utterance lists for GetNewYearFactIntent", function () {
        if (typeof(yearFactIntent) != "undefined")
          var utterances = yearFactIntent.samples
        else
          var utterances = []

        it('should have at least 15 utterances', function () {
            var count = utterances.length;
            expect(count).to.be.gte(15)
        })
        it('should have at least 15 FACT_YEAR slots', function () {
            var factsWithFourDigits = utterances.filter(function(utterance){
              return utterance.match(/{FACT_YEAR}/g)
            });

            var count = factsWithFourDigits.length

            expect(count).to.be.gte(15)
        })
    });
    describe("Testing IntentSchema for slots", function () {
        var slots = null;
        if (typeof(yearFactIntent) != "undefined")
          var slots = yearFactIntent.slots

        it('should include a slot', function () {
            expect(slots).to.exist
        })
        it('should include a slot named FACT_YEAR', function () {
            var hasCorrectSlot = false;
            for (var j = 0; j < slots.length; j++) {
                if (slots[j].name == "FACT_YEAR") {
                    hasCorrectSlot = true
                }
            }


            expect(hasCorrectSlot).to.be.true
        })
    });
});
