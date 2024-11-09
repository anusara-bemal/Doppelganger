const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { DeezerPlugin } = require('@distube/deezer');
const { YouTubePlugin } = require('@distube/youtube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

/// Call Config
const { TOKEN, PREFIX, OWNER_ID } = require("./settings/config.json");

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

/// Multi bot login support
for (let i = 0; i < TOKEN.length ; i++) {
    const client = new Client({
        shards: "auto",
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
        allowedMentions: { parse: ["users", "roles"] },
    });

    client.config = require('./settings/config.json');
    client.owner = client.config.OWNER_ID;
    client.dev = client.config.DEV_ID;
    client.color = client.config.EMBED_COLOR;

    client.prefix = PREFIX[i];
    client.owner = OWNER_ID;

    // Print bot token
    if (!client.token) client.token = TOKEN[i];

    client.distube = new DisTube(client, {
        savePreviousSongs: true,
        emitAddListWhenCreatingQueue: true,
        emitAddSongWhenCreatingQueue: true,
        plugins: [
            new SoundCloudPlugin(),
            new DeezerPlugin(),
            new YouTubePlugin(),
            new YtDlpPlugin({ update: false }),
            checkSpotify(client)
        ],
    });

    ["aliases", "commands"].forEach(x => client[x] = new Collection());
    ["loadCommands", "loadEvents", "loadPlayer", "loadDatabase"].forEach(x => require(`./handlers/${x}`)(client));

    client.login(client.token);
}

function checkSpotify(client) {
    if (client.config.SPOTIFY_TRACKS) {
        return spotifyOn(client);
    } else {
        return spotifyOff();
    }
}

function spotifyOn(client) {
    return new SpotifyPlugin({
        api: {
            clientId: client.config.SPOTIFY_ID,
            clientSecret: client.config.SPOTIFY_SECRET
        }
    })
}

function spotifyOff() {
    return new SpotifyPlugin({})
}