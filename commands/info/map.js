module.exports = {
    name: "map",
    aliases: ["dynmap", "worldmap", "world"],
    category: "info",
    description: "Pastes a link to the dynmap",
    run: (client, message) => {
        message.channel.send('**MAP**: http://www.totalwarremastered.tk/map/')
    }
}