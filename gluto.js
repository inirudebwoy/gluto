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
    var matches = /([a-zA-Z]*)\ ([a-zA-Z\ ]*)/.exec(message.text);
    if (matches !== null) {
        var details = commands.details(matches[2]);
        details.forEach(function(item) {
            bot.reply(message, item);
        });
    } else {
        bot.reply(message, "I am sorry but I didn't get that. Try again.");
    }
});

controller.hears(['vote'], 'direct_message,direct_mention', function(bot, message) {
    // TODO: factor out this bit
    var matches = /([a-zA-Z]*)\ ([a-zA-Z\ ]*)/.exec(message.text);
    // check if it is known place
    // if not ask to try voting again
    // start voting, print info how to vote
    // either on channel or by DM
    // user responses are matched against database, as conversation can only be
    // with one user, and then saved
    // saved voting can be used later recommending place to eat.
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
