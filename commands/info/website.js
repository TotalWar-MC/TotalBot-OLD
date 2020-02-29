module.exports = {
    name: "website",
    aliases: ["web", "site"],
    category: "info",
    description: "Pastes a link to the website",
    run: (client, message) => {
        message.channel.send('**WEBSITE**: http://www.totalwarremastered.tk/')
    }
}