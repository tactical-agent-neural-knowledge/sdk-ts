import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file tank/command/v1/command.proto.
 */
export declare const file_tank_command_v1_command: GenFile;
/**
 * @generated from message tank.command.v1.Command
 */
export type Command = Message<"tank.command.v1.Command"> & {
    /**
     * "roll"
     *
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * "Roll dice"
     *
     * @generated from field: string summary = 2;
     */
    summary: string;
    /**
     * "/roll 2d6"
     *
     * @generated from field: string usage = 3;
     */
    usage: string;
    /**
     * the rest of the line is the argument
     *
     * @generated from field: bool takes_text = 4;
     */
    takesText: boolean;
};
/**
 * Describes the message tank.command.v1.Command.
 * Use `create(CommandSchema)` to create a new message.
 */
export declare const CommandSchema: GenMessage<Command>;
/**
 * @generated from message tank.command.v1.ListCommandsRequest
 */
export type ListCommandsRequest = Message<"tank.command.v1.ListCommandsRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.command.v1.ListCommandsRequest.
 * Use `create(ListCommandsRequestSchema)` to create a new message.
 */
export declare const ListCommandsRequestSchema: GenMessage<ListCommandsRequest>;
/**
 * @generated from message tank.command.v1.ListCommandsResponse
 */
export type ListCommandsResponse = Message<"tank.command.v1.ListCommandsResponse"> & {
    /**
     * @generated from field: repeated tank.command.v1.Command commands = 1;
     */
    commands: Command[];
};
/**
 * Describes the message tank.command.v1.ListCommandsResponse.
 * Use `create(ListCommandsResponseSchema)` to create a new message.
 */
export declare const ListCommandsResponseSchema: GenMessage<ListCommandsResponse>;
/**
 * @generated from message tank.command.v1.RunCommandRequest
 */
export type RunCommandRequest = Message<"tank.command.v1.RunCommandRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string channel_id = 2;
     */
    channelId: string;
    /**
     * empty when typed in the Tread itself
     *
     * @generated from field: string thread_root_id = 3;
     */
    threadRootId: string;
    /**
     * the whole line: "/roll 2d6"
     *
     * @generated from field: string text = 4;
     */
    text: string;
    /**
     * what else is in the composer, for commands that rewrite it
     *
     * @generated from field: string draft = 5;
     */
    draft: string;
    /**
     * "HH:MM" in the person's zone, for times in arguments
     *
     * @generated from field: string local_time = 6;
     */
    localTime: string;
};
/**
 * Describes the message tank.command.v1.RunCommandRequest.
 * Use `create(RunCommandRequestSchema)` to create a new message.
 */
export declare const RunCommandRequestSchema: GenMessage<RunCommandRequest>;
/**
 * @generated from message tank.command.v1.RunCommandResponse
 */
export type RunCommandResponse = Message<"tank.command.v1.RunCommandResponse"> & {
    /**
     * Shown only to the person who ran it, in the thread, like an ephemeral card.
     *
     * @generated from field: string reply = 1;
     */
    reply: string;
    /**
     * A message the client posts as the person (the server already did anything else).
     *
     * @generated from field: string post = 2;
     */
    post: string;
    /**
     * Replace the composer's draft with this (the /tone family).
     *
     * @generated from field: string replace_draft = 3;
     */
    replaceDraft: string;
    /**
     * Open this channel (the /tread and /radar family).
     *
     * @generated from field: string open_channel_id = 4;
     */
    openChannelId: string;
};
/**
 * Describes the message tank.command.v1.RunCommandResponse.
 * Use `create(RunCommandResponseSchema)` to create a new message.
 */
export declare const RunCommandResponseSchema: GenMessage<RunCommandResponse>;
/**
 * @generated from service tank.command.v1.CommandService
 */
export declare const CommandService: GenService<{
    /**
     * @generated from rpc tank.command.v1.CommandService.ListCommands
     */
    listCommands: {
        methodKind: "unary";
        input: typeof ListCommandsRequestSchema;
        output: typeof ListCommandsResponseSchema;
    };
    /**
     * @generated from rpc tank.command.v1.CommandService.RunCommand
     */
    runCommand: {
        methodKind: "unary";
        input: typeof RunCommandRequestSchema;
        output: typeof RunCommandResponseSchema;
    };
}>;
