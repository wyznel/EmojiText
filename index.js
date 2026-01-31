/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import emoticons from "./emoticons.js";

const prefix = "&8[&6SimpleEmoji&8]&7";

//When registered, will check for 'key_name' and replace it with the corresponding emoticon.
const replaceMessageWithEmoticons = register("benyamin:typing", function(message) {
    const pattern = new RegExp(Object.keys(emoticons).map(k => `'${k}'`).join('|'), 'g');
    message = message.replace(pattern, (matched) => {
        const key = matched.replace(/'/g, ""); 
        return emoticons[key];
    });
    Client.setCurrentChatMessage(message + "!");
});

const { argument, choices, literal, exec } = Commands;

//register the main command with all its sub actions
Commands.registerCommand('emojitext', function() {

    exec(() => {
        ChatLib.chat(`${prefix} &7Invalid arguments. Type &c&l/emojitext help &7for more info.`)
    })

    argument("selec", choices('help', 'enable', 'disable'), () => {
        exec(({selec}) => {
            switch(selec) {
                case 'help': {
                    ChatLib.chat(new TextComponent({
                        text: `${prefix} &7To view list of available emoticons, run &c&l/emojitext view all`,
                        clickEvent: {
                            action: "run_command",
                            value: "/emojitext view all"
                        },
                        hoverEvent: {
                            action: "show_text",
                            value: `${prefix} Click to view all available emoticons ${prefix}`
                        }
                    }));
                    ChatLib.chat(new TextComponent({
                        text: `${prefix} To &aenable &7the auto-replacement, run &c&l/emojitext enable`,
                        clickEvent: {
                            action: "run_command",
                            value: "/emojitext enable"
                        },
                        hoverEvent: {
                            action: "show_text",
                            value: `${prefix} &7Click to &aenable &7auto-replacement ${prefix}`
                        }
                    }));
                    ChatLib.chat(new TextComponent({
                        text: `${prefix} To &cdisable &7the auto-replacement, run &c&l/emojitext disable`,
                        clickEvent: {
                            action: "run_command",
                            value: "/emojitext disable"
                        },
                        hoverEvent: {
                            action: "show_text",
                            value: `${prefix} &7Click to &cdisable &7auto-replacement ${prefix}`
                        }
                    }));
                    break;
                }
                case 'enable': {
                    ChatLib.chat(`${prefix} &aEnabled`);
                    replaceMessageWithEmoticons.register(); 
                    break;                  
                }
                case 'disable': {
                    ChatLib.chat(`${prefix} &cDisabled`);
                    replaceMessageWithEmoticons.unregister();                       
                }
            }
        });
    });
    //Viewing emoticons
    literal("view", () => {
        argument('type', choices('all'), () => {
            exec(({type}) => {
                if(type === 'all'){
                    ChatLib.chat(`${prefix} Click to copy the emoticon to your clipboard.`)
                    const keys = Object.keys(emoticons);
                    for(const key of keys){
                        ChatLib.chat(new TextComponent({
                            text: `&c${key}: &a${emoticons[key]}`,
                            clickEvent: {
                                action: "run_command",
                                value: `/emojitext copy ${key}`
                            },
                            hoverEvent: {
                                action: "show_text",
                                value: `Click to copy: &a${emoticons[key]}`
                            }
                        }));
                    }
                    ChatLib.chat(`${prefix} End of list, click to copy the emoticon to your clipboard.`);
                    ChatLib.chat(`${prefix} If the auto-replacement is enabled, you can type the key (e.g 'tick') surrounded by single quotes: &a'example_key', &7and it will be automatically replaced!`)
                }
            });
        });
    })

    literal('view', () => {
        exec(() => {
            ChatLib.chat(`${prefix} &7To view list of available emoticons, run &c&l/emojitext view all`);
        })
    })

    //Didn't want to have to resort to using a command to copy text to clipboard but here we are.
    literal('copy', () => {
        argument('emoticon_key', choices(Object.keys(emoticons)), () => {
            exec(({emoticon_key}) => {    
                ChatLib.chat(`${prefix} &aCopied &c&l${emoticons[emoticon_key]} &ato clipboard!`);
                Client.copy(emoticons[emoticon_key]);
            });
        });
    });
});


