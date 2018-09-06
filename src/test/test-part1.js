'use strict'
// const lambdaLocal = require('lambda-local');

var expect = require('chai').expect;
var assert = require('chai').assert;
var fs = require("fs");
// var sch = JSON.parse(fs.readFileSync('../speechAssets/IntentSchema.json', 'utf-8')); // Delete
var schema = JSON.parse(fs.readFileSync('./models/en-US.json', 'utf-8'));

var index = require('../lambda/index');
var facts = index.facts
// var utterances_2 = JSON.parse(fs.readFileSync('./models/en-US.json', "utf-8"));
var intents = schema.interactionModel.languageModel.intents;
// var facts = require('../facts');
var utils = require('./utils');

describe("Test Part 1", function () {

    describe("Testing utterance list", function () {
        it('should have at least 15 utterances for GetNewFactIntent', function () {

            var factIntent = schema.interactionModel.languageModel.intents.find(function(element){
              return element.name == 'GetNewFactIntent'
            });

            var count = factIntent.samples.length

            expect(count).to.be.gte(15)
        })
    })
    describe("Testing fact list items", function () {



       var jsonPayload = {
           'key': 1,
           'another_key': "Some text"
       }
       // console.log('$$$$')
       // lambdaLocal.execute({
       //     event: jsonPayload,
       //     lambdaPath:  './lambda/index.js',
       //     timeoutMs: 3000,
       //     callback: function(err, data) {
       //         if (err) {
       //             console.log(err);
       //         } else {
       //             console.log(data);
       //         }
       //     }
       // });
       // console.log('****')



        it('should have at least 10 facts', function () {
            expect(facts.length).to.be.gte(10)
        })
        it('should each include a 4-digit year', function () {
            var has4Digits = true;
            for (var i = 0; i < facts.length; i++) {
                if (!utils.hasFourDigitNumber(facts[i])) {
                    has4Digits = false;
                }
            }
            expect(has4Digits).to.be.true
        })
    })
});
