const Alexa = require('alexa-sdk');
const http = require('https');

const appId = 'amzn1.ask.skill.1cd0b48f-fc8e-428a-b7ab-b22e85367e6b';

const instructions = `Welcome to Smart Light<break strength="medium" /> 
                      The following commands are available: change color, turn on,
                      turn off, and cycle. What would you like to do?`;

const handlers = {
  
  // Open handler
  'LaunchRequest': function() {
    this.emit(':ask', instructions, "What did you want?");
  },
  
  // Turns lights on or off
  'ToggleIntent': function() {
    const intentObj = this.event.request.intent;
    const state = intentObj.slots.state.value;
    var path = '';
    if(state == "on")
      path = 'color?color=white';
    else
      path = state;
      
    var options = {
      host: 'smartled.run.aws-usw02-pr.ice.predix.io',
      port: 443,
      path: '/'+path,
      method: 'POST',
      headers: {
        'user': '607cd094-2842-4c5b-b9d6-d42079ebaad7'
      }
    };

    var qry = http.request(options, resp => {
      resp.setEncoding('utf8');
      
      //accept incoming data asynchronously
      resp.on('data', chunk => {
          console.log("Ok");
      });
      
      //return the data when streaming is complete
      resp.on('end', (e) => {
          this.emit(':tell', 'Turning off now!');
      });
      
      this.emit(':tell', 'Ok!');
    });
    
    qry.on('error', (e) => {
      this.emit(':tell', 'Unable to communicate with your lights.');
    });
    
    qry.end();
  },
  
  // Turns lights on or off
  'ColorIntent': function() {
    const intentObj = this.event.request.intent;
    const color = intentObj.slots.color.value;
      
    var options = {
      host: 'smartled.run.aws-usw02-pr.ice.predix.io',
      port: 443,
      path: '/color?color='+color,
      method: 'POST',
      headers: {
        'user': '607cd094-2842-4c5b-b9d6-d42079ebaad7'
      }
    };

    var qry = http.request(options, resp => {
      resp.setEncoding('utf8');
      
      //accept incoming data asynchronously
      resp.on('data', chunk => {
          console.log("Ok");
      });
      
      //return the data when streaming is complete
      resp.on('end', (e) => {
          this.emit(':tell', 'Turning off now!');
      });
      
      this.emit(':tell', 'Ok!');
    });
    
    qry.on('error', (e) => {
      this.emit(':tell', 'Unable to communicate with your lights.');
    });
    
    qry.end();
  },
  
  // Sets lights to cycle mode
  'CycleIntent': function() {
    var options = {
      host: 'smartled.run.aws-usw02-pr.ice.predix.io',
      port: 443,
      path: '/rainbow?cycle=cycle',
      method: 'GET',
      headers: {
        'user': '607cd094-2842-4c5b-b9d6-d42079ebaad7'
      }
    };

    var qry = http.request(options, resp => {
      resp.setEncoding('utf8');
      
      //accept incoming data asynchronously
      resp.on('data', chunk => {
          console.log("Ok");
      });
      
      //return the data when streaming is complete
      resp.on('end', (e) => {
          this.emit(':tell', 'Cycling!');
      });
      
      this.emit(':tell', 'Ok!');
    });
    
    qry.on('error', (e) => {
      this.emit(':tell', 'Unable to communicate with your lights.');
    });
    
    qry.end();
  },

  // Unhandled respnonse
  'Unhandled': function() {
    console.error('problem', this.event);
    this.emit(':ask', 'An unhandled problem occurred!');
  },

  // Replay instructions
  'AMAZON.HelpIntent'() {
    const speechOutput = instructions;
    const reprompt = instructions;
    this.emit(':ask', speechOutput, reprompt);
  },

  // Below are cancel and stop intents
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.StopIntent': function() {
    this.emit(':tell', 'See you later!');
  }
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = appId; 
    alexa.registerHandlers(handlers);
    alexa.execute();
};