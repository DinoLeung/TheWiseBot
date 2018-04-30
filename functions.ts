import * as fs from "fs";
const dir = "./storage/";
const theHeartSutra = fs.readFileSync("./files/the_heart_sutra", "utf8");

// Coin
export const coin = () => (Math.random() >= 0.5 ? "Heads" : "Tails");

// Dice
export const die = () => String(Math.floor(Math.random() * 6) + 1);
export const dice = () => {
        return (Math.floor(Math.random() * 6) + 1) + " - " +
                (Math.floor(Math.random() * 6) + 1) + " - " +
                (Math.floor(Math.random() * 6) + 1);
    };

// Stack
const originalStack = [
    "♠️ A", "♠️ 2", "♠️ 3", "♠️ 4", "♠️ 5", "♠️ 6", "♠️ 7", "♠️ 8", "♠️ 9", "♠️ 10", "♠️ J", "♠️ Q", "♠️ K",
    "♥️ A", "♥️ 2", "♥️ 3", "♥️ 4", "♥️ 5", "♥️ 6", "♥️ 7", "♥️ 8", "♥️ 9", "♥️ 10", "♥️ J", "♥️ Q", "♥️ K",
    "♣️ A", "♣️ 2", "♣️ 3", "♣️ 4", "♣️ 5", "♣️ 6", "♣️ 7", "♣️ 8", "♣️ 9", "♣️ 10", "♣️ J", "♣️ Q", "♣️ K",
    "♦️ A", "♦️ 2", "♦️ 3", "♦️ 4", "♦️ 5", "♦️ 6", "♦️ 7", "♦️ 8", "♦️ 9", "♦️ 10", "♦️ J", "♦️ Q", "♦️ K",
];
const originalData = JSON.parse(JSON.stringify({
    single: false,
    stack: originalStack,
}));

const getSetting = (id: string) => {
    try {
        const json = JSON.parse(fs.readFileSync(dir + id, "utf8"));
        return json;
    } catch (err) {
        if (err.code === "ENOENT") {
            // file not found
            setSetting(id, originalData);
            return originalData;
        } else {
            // tslint:disable-next-line:no-console
            console.log(err);
        }
    }
    return null;
};

const setSetting = (id: string, json?: JSON) => {
    if (!fs.existsSync(dir)) {
        // directory not found
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + id, JSON.stringify(json));
};

export const card = (id?: string) => {
    let setting;
    if (id) {
        setting = getSetting(id);
    } else {
        setting = originalData;
    }

    if (setting.single) {
        if  (setting.stack.length === 0) {
            return ("\nYou wanna dance, you gotta pay the band, you understand? "
                + "If you wanna \/draw, you gotta \/shuffle the stack");
        } else {
            const c = setting.stack[Math.floor(Math.random() * setting.stack.length)];
            setting.stack = setting.stack.filter((e: string) => e !== c);
            setSetting(id, setting);
            return (c + "\n" + setting.stack.length + " card(s) left in the stack.");
        }

    } else {
        const suits = ["♠️", "♥️", "♣️", "♦️"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        return (suits[Math.floor(Math.random() * suits.length)] +
                " " +
                ranks[Math.floor(Math.random() * ranks.length)]);
    }
};

export const toggleSingle = (id: string) => {
    let msg;
    // tslint:disable-next-line:prefer-const
    let setting = getSetting(id);
    // trigger single stack mode
    if (setting.single) {
        setting.single = false;
        msg = ("Now you \/draw a card from a new stack every time." + "\n" + "Call again to enable.");
    } else {
        setting.single = true;
        // tslint:disable-next-line:max-line-length
        msg = ("Now you will never \/draw the same card until you \/shuffle the stack. " + "\n" + "Call again to disable.");
    }
    setSetting(id, setting);
    return msg;
};

export const shuffle = (id: string) => {
    // tslint:disable-next-line:prefer-const
    let setting = getSetting(id);
    // restore the stack in single stack mode
    if (setting.single) {
        setting.stack = originalStack;
        setSetting(id, setting);
        return "A brand new stack has been shuffled." + "\n" + setting.stack.length + " card(s) left in the stack.";
    } else {
        return "You are not in \/singlestack mode.";
    }
};

// Pick one from list
export const one = (txt: string) => {
    const invalidChoices = "Huh? My hearing isn't too well. Try again with following pattern: \/pick 🅰️, 🅱️, ...";
    txt = txt.trim();
    if (txt.length > 0) {
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

export const letMeGoogle = (txt: string) => {
    txt = txt.trim();
    if (txt.length > 0) {
        const keywords = txt.split(" ").map((item) => encodeURIComponent(item.trim())).filter((item) => item !== "");
        const str = "Any fool can know. The point is to understand."
                    + "\n"
                    + "I found a lot regarding to *" + txt + "* you could know "
                    + "[here](" + "http://lmgtfy.com/?iie=1&q=" + keywords.join("+") + ")."
                    // + "[here](" + "http://www.letmegooglethat.com/?q=" + keywords.join("+") + ")."
                    + "\n"
                    + "But can you understand, it's entirely depends on you.";
        return str;
    } else {
        return theHeartSutra;
    }
};

export const suggest = (txt: string, username: string, MYID: string, tele: any) => {
    // tslint:disable-next-line:max-line-length
    const invalidSuggestion = "Huh? My hearing isn't too well. Try again with \/suggest and follow by your suggestions. The universe won't accept blank suggestions.";
    txt = txt.trim();
    if (txt.length > 0) {
        tele.sendMessage(MYID, "@" + username + " suggested to " + txt);
        return "May the universe be with you, I will look into this soon. 💪";
    } else {
        return invalidSuggestion;
    }
};
