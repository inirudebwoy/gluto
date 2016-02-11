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

controller.hears(['users'], 'direct_message,mention', function(bot, message) {
    var list = bot.api.users.list({}, function(err, response) {
        response.members.filter(function(item) {
            bot.api.users.getPresence({user: item.id}, function(err, response) {
                bot.reply(message, response);
                bot.reply(message, item.id);
            });
        });
    });
});

controller.hears(['vote'], 'direct_message,direct_mention', function(bot, message) {

    // IDEA;
    // users vote by providing name of the place where they want to eat.

    bot.startConversation(message, function(err, convo) {
        var team_data = {votes: [],
                         id: 'vote',
                         init: message.user};

        controller.storage.teams.save(team_data, function(err) {
            convo.say('Voting starts.');
        });

        bot.api.users.info({user: message.user}, function(err, response) {
            convo.say(response.user.name + ' started the voting.');
            convo.say('How to vote you ask?');
            convo.say('Say the name of place where you want to go on the channel or privately to me.');
        });
    });
});

controller.on('ambient,direct_message', function(bot, message) {
    controller.storage.teams.get('vote', function(err, team) {
        // vote is on
        if (team && commands.exists(message.text)) {
            var voteIndex = team.votes.findIndex(function(element, index, array) {
                if (element[0] == message.text) {
                    return true;}
                return false;
            });
            team[voteIndex] = [message.user, message.text];
            controller.storage.teams.save(team, function(err) {
                bot.reply(message, 'OK, I read you. You are voting for ' + message.text);
            });
        } else if (team && !commands.exists(message.text)) {
            bot.reply(message, 'This place is not on the list');
        }
    });
});

controller.on('tick', function() {
    // handling ticks, might be used for tracking time
    controller.storage.teams.get('vote', function(err, team) {
        if (team) {
            // vote counting
            // l.forEach(function(x) {counts[x[1]] = (counts[x[1]] || 0) + 1 });
            console.log('team: ' + team.votes);
            console.log('id: ' + team.id);
            console.log('init: ' + team.init)
        }
    });
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
