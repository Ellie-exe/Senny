import { Client, GuildMember, Message, MessageEmbed, Snowflake, User } from 'discord.js';
import { Interaction } from './utils';

type Client = Client;
type Message = Message;
type args = string[];

declare class Utils {
    constants: Constants;

    logger: {
        debug(message: any): void;
        info(message: any): void;
        warn(message: any): void;
        error(message: any): void;
	};

    isAdmin(member: GuildMember, guild: Snowflake): boolean;
    isMod(member: GuildMember, guild: Snowflake): boolean;
}

declare class Interaction {
    token: string;
    member: GuildMember;
    user: User;
    id: Snowflake;
    guildID: Snowflake;
    guild_id: Snowflake;
    data: any;
    channelID: Snowflake;
    channel_id: Snowflake;
    authorID: Snowflake;
    userID: Snowflake;
    client: Client;
    
    send(content: any, options: {type: number, flags: number}): Promise<Message>;
    embed(embed: MessageEmbed): Promise<Message>;
    edit(content: any): Promise<Message>;
}

declare class Constants {
    colors: {
        DeepSkyBlue: number,
        BrilliantAzure: number
    }

    emojis: {
        greenTick: string,
        redX: string
    }
}