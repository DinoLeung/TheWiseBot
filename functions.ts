// Coin
export let coin = () => (Math.random() >= 0.5 ? "Heads" : "Tails");

// Dice
export let die = () => String(Math.floor(Math.random() * 6) + 1);
export let dice = () => {
        return (Math.floor(Math.random() * 6) + 1) + " - " +
                (Math.floor(Math.random() * 6) + 1) + " - " +
                (Math.floor(Math.random() * 6) + 1);
    };

// Stack
// tslint:disable-next-line:max-line-length
const originalStack = [
    "♠️ A", "♠️ 2", "♠️ 3", "♠️ 4", "♠️ 5", "♠️ 6", "♠️ 7", "♠️ 8", "♠️ 9", "♠️ 10", "♠️ J", "♠️ Q", "♠️ K",
    "♥️ A", "♥️ 2", "♥️ 3", "♥️ 4", "♥️ 5", "♥️ 6", "♥️ 7", "♥️ 8", "♥️ 9", "♥️ 10", "♥️ J", "♥️ Q", "♥️ K",
    "♣️ A", "♣️ 2", "♣️ 3", "♣️ 4", "♣️ 5", "♣️ 6", "♣️ 7", "♣️ 8", "♣️ 9", "♣️ 10", "♣️ J", "♣️ Q", "♣️ K",
    "♦️ A", "♦️ 2", "♦️ 3", "♦️ 4", "♦️ 5", "♦️ 6", "♦️ 7", "♦️ 8", "♦️ 9", "♦️ 10", "♦️ J", "♦️ Q", "♦️ K",
];

// tslint:disable-next-line:prefer-const
let settings = (id: string) => {
    let localStorage: any;
    localStorage = (typeof localStorage === "undefined") ? null : localStorage;
    // tslint:disable-next-line:no-var-requires
    const LocalStorage = require("node-localstorage").LocalStorage;
    if (typeof localStorage === "undefined" || localStorage === null) {
        localStorage = new LocalStorage("./storage");
    }
    if (localStorage.getItem(id) === null) {
        localStorage.setItem(id, JSON.stringify([false, originalStack]));
    }
    return JSON.parse(localStorage.getItem(id));
};

export let card = (id?: string) => {
    let setting;
    if (id) {
        setting = settings(id);
    } else {
        setting = [false, originalStack];
    }

    if (setting[0]) {
        if (setting[1].length === 0) {
            setting[1] = originalStack;
        }
        const c = setting[1][Math.floor(Math.random() * setting[1].length)];
        setting[1] = setting[1].filter((e: string) => e !== c);
        localStorage.setItem(id, JSON.stringify(setting));
        return (c + "\n" + setting[1].length + " card(s) left in the stack.");
    } else {
        const suits = ["♠️", "♥️", "♣️", "♦️"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        return (suits[Math.floor(Math.random() * suits.length)] +
                " " +
                ranks[Math.floor(Math.random() * ranks.length)]);
    }
};

export let toggleSingle = (id: string) => {
    let msg;
    const setting = settings(id);
    // trigger single stack mode
    if (setting[0]) {
        setting[0] = false;
        msg = ("Now you \/draw a card from a new stack every time." + "\n" + "Call again to enable.");
    } else {
        setting[0] = true;
        // tslint:disable-next-line:max-line-length
        msg = ("Now you will never \/draw the same card until you \/shuffle the stack. " + "\n" + "Call again to disable.");
    }
    localStorage.setItem(id, JSON.stringify(setting));
    return msg;
};

export let shuffle = (id: string) => {
    const setting = settings(id);
    // restore the stack in single stack mode
    if (setting[0]) {
        setting[1] = originalStack;
        localStorage.setItem(id, JSON.stringify(setting));
        return "A brand new stack has been shuffled." + "\n" + setting[1].length + " card(s) left in the stack.";
    } else {
        return "You are not in \/singlestack mode.";
    }
};

// Pick one from list
export let one = (txt: string) => {
    const invalidChoices = "Huh? My hearing isn't too well. Try again with following pattern: \/pick 🅰️, 🅱️, ...";
    const i = txt.trim().indexOf(" ");
    if (i > 0) {
        txt = txt.substr(i + 1);
        const options = txt.split(",").map((item) => item.trim()).filter((item) => item !== "");
        if (options.length === 1) {
            return (options[0] +
                " is the one and the only one. Unlike the universe, there're multiple of them existing parallely.");
        } else if (options.length > 0) {
            return ("Out of " + options.join(", ") + "\n*" +
                options[Math.floor(Math.random() * options.length)] +
                "* has to be the one. 😉");
             } else {
            return (invalidChoices);
             }
    } else {
        return (invalidChoices);
    }
};

export let suggest = (txt: string, username: string, MYID: string, tele: any) => {
    // tslint:disable-next-line:max-line-length
    const invalidSuggestion = "Huh? My hearing isn't too well. Try again with \/suggest and follow by your suggestions. The universe won't accept blank suggestions.";
    const i = txt.trim().indexOf(" ");
    if (i > 0) {
        txt = txt.substr(i + 1);
        if (txt.trim().length > 0) {
            tele.sendMessage(MYID, "@" + username + " suggested to " + txt);
            return "May the universe be with you, I will look into this soon. 💪";
        } else {
            return invalidSuggestion;
        }
    } else {
        return invalidSuggestion;
    }
};
