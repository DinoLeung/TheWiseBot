"use strict";
exports.__esModule = true;
//Coin
exports.coin = function () { return (Math.random() >= 0.5 ? "Heads" : "Tails"); };
//Dice
exports.die = function () { return String(Math.floor(Math.random() * 6) + 1); };
exports.dice = function () {
    return (Math.floor(Math.random() * 6) + 1) + ' - ' +
        (Math.floor(Math.random() * 6) + 1) + ' - ' +
        (Math.floor(Math.random() * 6) + 1);
};
//Stack
var stack_o = ['♠️ A', '♠️ 2', '♠️ 3', '♠️ 4', '♠️ 5', '♠️ 6', '♠️ 7', '♠️ 8', '♠️ 9', '♠️ 10', '♠️ J', '♠️ Q', '♠️ K',
    '♥️ A', '♥️ 2', '♥️ 3', '♥️ 4', '♥️ 5', '♥️ 6', '♥️ 7', '♥️ 8', '♥️ 9', '♥️ 10', '♥️ J', '♥️ Q', '♥️ K',
    '♣️ A', '♣️ 2', '♣️ 3', '♣️ 4', '♣️ 5', '♣️ 6', '♣️ 7', '♣️ 8', '♣️ 9', '♣️ 10', '♣️ J', '♣️ Q', '♣️ K',
    '♦️ A', '♦️ 2', '♦️ 3', '♦️ 4', '♦️ 5', '♦️ 6', '♦️ 7', '♦️ 8', '♦️ 9', '♦️ 10', '♦️ J', '♦️ Q', '♦️ K'];
var settings = function (id) {
    if (localStorage.getItem(id) === null)
        localStorage.setItem(id, JSON.stringify([false, stack_o]));
    return JSON.parse(localStorage.getItem(id));
};
exports.card = function (id) {
    var setting;
    if (id)
        setting = settings(id);
    else
        setting = [false, stack_o];
    if (setting[0]) {
        if (setting[1].length == 0)
            setting[1] = stack_o;
        var card = setting[1][Math.floor(Math.random() * setting[1].length)];
        setting[1] = setting[1].filter(function (e) { return e !== card; });
        localStorage.setItem(id, JSON.stringify(setting));
        return (card + "\n" + setting[1].length + ' card(s) left in the stack.');
    }
    else {
        var suits = ['♠️', '♥️', '♣️', '♦️'];
        var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return (suits[Math.floor(Math.random() * suits.length)] + ' ' + ranks[Math.floor(Math.random() * ranks.length)]);
    }
};
exports.toggleSingle = function (id) {
    var msg;
    var setting = settings(id);
    //trigger single stack mode
    if (setting[0]) {
        setting[0] = false;
        msg = ('Now you \/draw a card from a new stack every time.' + "\n" + 'Call again to enable.');
    }
    else {
        setting[0] = true;
        msg = ('Now you will never \/draw the same card until you \/shuffle the stack. ' + "\n" + 'Call again to disable.');
    }
    localStorage.setItem(id, JSON.stringify(setting));
    return msg;
};
exports.shuffle = function (id) {
    var setting = settings(id);
    //restore the stack in single stack mode
    if (setting[0]) {
        setting[1] = stack_o;
        localStorage.setItem(id, JSON.stringify(setting));
        return 'A brand new stack has been shuffled.' + "\n" + setting[1].length + ' card(s) left in the stack.';
    }
    else {
        return 'You are not in \/singlestack mode.';
    }
};
//Pick one from list
exports.one = function (txt) {
    var invalid_choices = 'Huh? My hearing isn\'t too well. Try again with following pattern: \/pick 🅰️, 🅱️, ...';
    var i = txt.trim().indexOf(' ');
    if (i > 0) {
        txt = txt.substr(i + 1);
        var options = txt.split(',').map(function (item) { return item.trim(); }).filter(function (item) { return item !== ''; });
        if (options.length == 1)
            return (options[0] + ' is the one and the only one. Unlike the universe, there\'re multiple of them existing parallely.');
        else if (options.length > 0)
            return ('Out of ' + options.join(', ') + '\n*' + options[Math.floor(Math.random() * options.length)] + '* has to be the one. 😉');
        else
            return (invalid_choices);
    }
    else
        return (invalid_choices);
};
exports.suggest = function (txt, username, MYID, tele) {
    var invalid_suggestion = 'Huh? My hearing isn\'t too well. Try again with \/suggest and follow by your suggestions. The universe won\'t accept blank suggestions.';
    var i = txt.trim().indexOf(' ');
    if (i > 0) {
        txt = txt.substr(i + 1);
        if (txt.trim().length > 0) {
            tele.sendMessage(MYID, '@' + username + ' suggested to ' + txt);
            return 'May the universe be with you, I will look into this soon. 💪';
        }
        else {
            return invalid_suggestion;
        }
    }
    else {
        return invalid_suggestion;
    }
};
