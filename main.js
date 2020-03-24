let Discord = require("discord.js");

let botToken = "NjkxODE3OTk0NDU1ODc1NTk1.XnljCQ.sXpWwV9fB29K8GkMClzLy14dTx0";

let servers = ["388915017187328002"];

let infectReact = "🦠";
let disinfectReact = "💉";
let quarantineChannels = ["688916582994542682"];

let infectedRoleName = "689339039664308284";

let infectionMessage = "Ut Oh! You now have the plague!";

let Client = new Discord.Client();

function skipServer(message) {
    if (servers.indexOf(message.guild.id) === -1) return true;
    if (!message.member || message.member.user.bot) return true;
}

function getInfectedRole(message) {
    return message.guild.roles.cache.find(r => r.id === infectedRoleName);
}

function isInfected(message) {
    let role = getInfectedRole(message);

    return message.member.roles.cache.some(r => r.id === role.id);
}

function infect(message) {
    let role = getInfectedRole(message);

    return message.member.roles
        .add(role)
        .then(() => message.react(infectReact))
        .then(() => message.channel.send(infectionMessage))
        .then(() => message.delete({ timeout: 2500 }))
        .catch(error => console.error(error.toString()));
}

function disinfect(message) {
    let role = getInfectedRole(message);

    return message.member.roles
        .remove(role)
        .then(() => message.react(disinfectReact))
        .then(() => message.delete({ timeout: 2500 }))
        .catch(error => console.error(error.toString()));
}

Client.login(botToken).catch(err => console.log(err.toString()));

Client.on("message", message => {
    // If this isn't for a server we are monitoring or a bot messaged bail out now
    if (skipServer(message)) return;

    if (isInfected(message)) {
        if (message.content.startsWith("!vaccinate")) {
            return disinfect(message);
        }

        return message
            .react(infectReact)
            .catch(error => console.error(error.toString()));
    } else {
        if (quarantineChannels.indexOf(message.channel.id) === -1) return;

        return infect(message);
    }
});

Client.on("error", () => process.exit());
