/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Gluto

This is a sample Slack bot built with Botkit.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var commands = require('./commands');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['help'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Available commands:');
    bot.reply(message, '`random` -  I select random location for you');
    bot.reply(message, '`recommend` - I can recommend you location based on your preference');
    bot.reply(message, '`details name` - I tell you details of selected location');
    bot.reply(message, '`all places` - I tell you all the locations I know');
});

controller.hears(['random'], 'direct_message,direct_mention,mention',function(bot, message) {
    bot.reply(message, "Why don't you go to " + commands.random());
});

controller.hears(['recommend'], 'direct_message,direct_mention,mention',function(bot, message) {
    bot.reply(message, "I'd recommend " + commands.recommend());
});

controller.hears(['all places', 'everything'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the list of all places to choose from: ");
    commands.locations.forEach(function(item) {
        bot.reply(message, item);
    });
    bot.reply(message, "Why don't you go to " + commands.random());
});

controller.hears(['details'], 'direct_message,direct_mention,mention', function(bot, message) {
    var choice = commands.extractPlace(message.text);
    if (choice !== null) {
        var details = commands.details(choice);
        details.forEach(function(item) {
            bot.reply(message, item);
        });
    } else {
        bot.reply(message, "I am sorry but I didn't get that. Try again.");
    }
});

controller.hears(['vote'], 'direct_message,direct_mention', function(bot, message) {
    var choice = commands.extractPlace(message.text);
    // check if it is known place
    if (commands.exists(choice) === null) {
        // if not ask to try voting again
        bot.reply(message, "Place does not exist. Try different.")
    } else {
        // start voting, print info how to vote
        var team_data = {vote: {required: 0,  // TODO: take number of logged in people on channel
                                given: 0,
                                init: message.user
                               },
                         id: 'vote'
                        };
        controller.storage.teams.save(team_data, function(err) {
            bot.reply(message, 'Voting starts.');
        });

        // save user vote
        controller.storage.users.get(message.user, function(err, user) {
            if (!user) {
                user = {};
            }
            var voteCount = user[choice];
            if (!voteCount) {
                voteCount = 1;
            }
            voteCount += 1;
            user[choice] = voteCount;
            controller.storage.users.save(user, function(err, id) {
                bot.reply(message, 'I will remember your vote.');
            });
        });

        // either on channel or by DM
        bot.startConversation(message, function(err, convo) {
            // TODO: person who started the vote needs to be named by bot
            convo.say(message.user + ' started vote for ' + choice);
            convo.say('You can vote in the channel or by talking directly to me.');
            convo.say('How to vote you ask?');
            convo.say('If you agree say: yeah, yup, yes, +1');
            convo.say('If you disagree say: no, nope, nah, -1, balls');
            convo.say('or simply don\'t vote');
        });

    }
    // user responses are matched against database, as conversation can only be
    // with one user, and then saved
    // team storage has current vote ID, number of votes given and number required
    // user storage has all his votes with vote IDs
    // saved voting can be used later recommending place to eat.
});

controller.on('ambient', function(bot, message) {
    // gather votes here if voting is running
});

controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });


    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Hello ' + user.name + '!!');
        } else {
            bot.reply(message,'Hello.');
        }
    });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});


controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
