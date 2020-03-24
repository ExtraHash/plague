const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", message => {
    // if this is a DM dont answer
    if (!message.guild) return;
    // dont respond to yourself
    if (message.author.bot) return;
    let quarantineChannel = message.channel.id == "691845339241644074";
    // are we in a quarantine channel?
    if (quarantineChannel) {
        // this is the role of the infected users
        // message.guild.roles.cache.each(role => console.log(role.name));
        let infectedRole = message.guild.roles.find(r => r.name === "infected");
        // this is the infection emoji to put on every infected users
        // messages
        let emoji = message.guild.emojis.cache.find("name", "microbe");
        // if we are, is the user who just spoke already infected?
        if (infectedRole) {
            // react with the infection emoji
            message.react(emoji);
            console.log(`A sickly voice is heard...`);
        } else {
            // report the message id we are responding to
            console.log("Received #" + message.id + ": " + message.content);
            // respond the first time we infect a user with 'oh no'
            message.channel
                .send("oh no..")
                .then(message =>
                    console.log("Sent #" + message.id + ": " + message.content)
                )
                .catch(console.error);
            // add the infected role
            message.member.roles.add(infectedRole.id).catch(console.error);
            console.log(`added user to the swarm`);
        }
    } else if (!quarantineChannel) {
        console.log("we dont care");
    }
});

client.login("E3OTD0NDU.Hunter2.dTx0OTkNjkxOD");
