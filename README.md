# SatanBot

> SatanBot is a discord bot written in typescript with discord.js.\
> This bot is designed to be used on one server per instance per discord program due to the database

-   I wrote this for fun for a personal server.
-   There are parts of this bot that I am decently happy with some not so much (I'm looking at you music and tierlist service)
-   I figured I would open source it in case anyway would get some use out of it.
-   This was designed with the intention of being deployed on a raspberry pi, for this project to run on a raspberry pi it NEEDS to be a pi 4 with the ARM v8 processor (This is needed for mongodb)
-   It can also be run on a local machine easily as long as docker is installed

## Configuration

-   If you are not using a raspberry pi or know how to setup, install docker and git you can skip to the Quick Start section
    > My raspberry pi is running ubuntu server NOT raspian.\
    > I think raspbian can be used but when I initially started this project I remember a headache of some sort when attempting to install docker on raspbian. It probably can be done but I haven't given it much effort to offer advice. So, the following instructions might not apply.
-   Update system

```bash
sudo apt-get update && sudo apt upgrade
```

-   Install docker-compose

```bash
sudo snap install docker
sudo usermod -aG docker $USER
sudo reboot
```

### Quick Start

> Use [git](https://git-scm.com/downloads) and [docker-compose](https://www.docker.com/) to install and run SatanBot.

```bash
git clone https://github.com/BrianTipton1/SatanBot.git
cd SatanBot
mv example.env .env
vim .env
```

> Edit the .env file and change the value of TOKEN to whatever your discord bot token is.\
> Leave the MONGO_CONNECTION_STRING as is.

-   This is the default env to connect to the mongodb container
-   MONGO_CONNECTION_STRING=mongodb://root:satans-passwd@mongo:27017/satandb

```bash
docker-compose up -d
```

## Features

-   Music
    -   Can be used to just play songs individually in a que style or can save playlists for later
-   Tierlists
    -   Displayed using ascii grids
    -   Options
        -   Classic
        -   Numerical
-   Ascii Art
    -   Allows you to save and repost commonly used ascii art for later
-   Flip
    -   Flip a coin
-   Roll
    -   Roll a number
    -   Can specifiy a range for the number to be rolled
-   Logging
    -   Messages
        -   The following is saved to the database
            -   New Messages
            -   Edited Messages
            -   Deleted Messages
    -   Voice
        -   The following is saved to the database
            -   Entering a voice channel
            -   Leaving a voice channel
            -   The time spent in the voice channel
-   Welcome Message
    -   Sends a welcome message to the person who joins the server

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## TODO

-   Create stat plots service with julia using data from mongodb
-   Find 403 bug in music service (I think it's from ytdl-core failing to retrieve the stream but I can't seem to catch it)
-   Refactor music, command and tierlist service
-   Allow for custom greetings saved to database
-   Ability to ban, see message or voicechannel logs by messaging bot

## License

[MIT](https://choosealicense.com/licenses/mit/)
