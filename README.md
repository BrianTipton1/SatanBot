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
    -   Two different commands
        -   Play
            -   Used to play songs in a que style
                Example:
            ```bash
            -p https://www.youtube.com/watch?v=dQw4w9WgXcQ
            ```
            -   This will either start playing the audio or add it to the end of the que if already playing
            -   If playing a playlist this command will stop it and start playing the new audio immediately
        -   Music
            -   Options
                -   Skip current song
                    -   This will skip the next song in a que or playlist
                    -   If it is the last song the bot will leave the voice channel\
                        Example:
                    ```bash
                    -m skip
                    ```
                -   Stop playing music
                    -   Bot will leave voice channel and delete que if needed\
                        Example:
                    ```bash
                    -m stop
                    ```
                -   Pause music
                    -   Just pauses the currently playing audio\
                        Example:
                    ```bash
                    -m pause
                    ```
                -   Unpause Music
                    -   Just unpauses the audio\
                        Example:
                    ```bash
                    -m unpause
                    ```
                -   Create a playlist\
                    Example:
                    `bash -m create -n myCoolPlaylist `
                -   Add song to a playlist\
                     Example:
                    ```bash
                    -m add -n myCoolPlaylist -v https://www.youtube.com/watch?v=dQw4w9WgXcQ
                    ```
                -   Play an already saved playlist\
                     Example:
                    ```bash
                    -m play -n myCoolPlaylist
                    ```
                -   Delete a playlist\
                     Example:
                    ```bash
                    -m play -n myCoolPlaylist
                    ```

-   Tierlists

    -   Displayed using ascii grids
    -   Options

        -   Classic

            -   Example:

            ```bash
            -t alpha -n Fries
            ```

            -   This Creates an alphabetical or 'classic' style tierlist with the name 'Fries'
            -   Adding to tierlist
                -   Must be done in the tierlist thread created by the bot
            -   Example:

            ```bash
            -B Carls/Hardees
            -A Pen Station
            -F Burger King
            -A Mcdonalds
            -S Freddys
            -S Arbys
            ```

            -   Result Below \
                ![alt text](https://github.com/BrianTipton1/SatanBot/tree/master/READMEAssets/alphalist.png)

        -   Numerical
            -   Example:
            ```bash
            -t num -n Fries
            ```
            -   This creates a numerical tierlist with the name 'Fries'
            -   Adding to the tierlist
                -   Must be done in the tierlist thread created by the bot
            -   Example:
            ```bash
            -1 Arbys
            -2 Freddys
            -3 Mcdonalds
            -4 Steak N Shake
            -5 Pen Station
            ```
            -   Result below \
                ![alt text](https://github.com/BrianTipton1/SatanBot/tree/master/READMEAssets/numtlist.png)

-   Ascii Art

    -   Allows you to save and repost commonly used ascii art for later

    Example Commands:

    > Posts the art saved under the name bigChungus

    ```bash
    -a post -n bigChungus
    ```

    > Saves the art specified after the -v flag as bigChungus in the databse

    ```bash
    -a save -n bigChungus -v CHUNGUSART
    ```

    > Deletes the art from the database under the name bigChungus

    ```bash
    -a delete -n bigChungus
    ```

    > Lists all the art saved in the database

    ```bash
    -a list
    ```

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

> Help command below

```bash
Usage: SatanBot [options]

Currently all of the commands SatanBot can do

Options:
  -a, --ascii <Action to preform>       Need to specifiy a name with the -n flag and art with -v flag.
              Example: '-a save -n chungus -v INSERT-ASCII-HERE'
   (choices: "save", "delete", "post", "list")
  -t, --tierlist <Tierlist Type>        Need to specifiy a name with the -n flag.
              Example '-t alpha -n Hotdogs'
   (choices: "alpha", "num")
  -n, --name <Name of Item>
  -v, --value <Some value to be saved>
  -p, --play <Url to youtube video>
          Used to just que music w/o playlist
          Example '--play http://someyoutubesong.com/)'
  -m, --music <action>
          stop -(Stops music playing in channel)
          play -(Start Playing a playlist with a name parameter)
          unpause -(Unpause currntly paused music)
          pause -(Pauses Currently Playing Music)
          create - (Create a playlist witha name parameter)
          delete - (Delete a playlist with a name parameter)
          add - (Add music to a playlist with a name and value parameter)
          skip - (skips the current song and starts playing the next in que or next in playlist)
   (choices: "unpause", "stop", "skip", "pause", "play", "create", "delete", "add")
  -r, --roll [69-420]
          Can supply a low and high or no value to roll from 0-100
          Example: '--roll 69-420'
   (default: "default")
  -f, --flip
          Flips a coin
  -h, --help                            display help for command
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## TODO

-   Create stat plots service with julia using data from mongodb
-   Find 403 bug in music service (I think it's from ytdl-core failing to retrieve the stream but I can't seem to catch it)
-   Refactor music, command and tierlist service
-   Allow for custom greetings saved to database
-   Log users who are new, banned or left the server
-   Ability to ban, see message or voicechannel logs by messaging bot

## License

[MIT](https://choosealicense.com/licenses/mit/)
