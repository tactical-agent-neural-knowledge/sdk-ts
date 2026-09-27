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
 * A macro: a name that runs a sequence of command lines. "$1", "$2"… in a step
 * take the words given when the macro runs; "$*" takes them all.
 *
 * @generated from message tank.command.v1.Macro
 */
export type Macro = Message<"tank.command.v1.Macro"> & {
    /**
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * "standup"; runs as /standup
     *
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * "/catchup", "/tldr post", "/later 9:00 tomorrow Standup"
     *
     * @generated from field: repeated string steps = 3;
     */
    steps: string[];
    /**
     * Empty for a personal macro; a workspace macro (admins) is for everyone.
     *
     * @generated from field: bool workspace = 4;
     */
    workspace: boolean;
    /**
     * @generated from field: string created_by = 5;
     */
    createdBy: string;
};
/**
 * Describes the message tank.command.v1.Macro.
 * Use `create(MacroSchema)` to create a new message.
 */
export declare const MacroSchema: GenMessage<Macro>;
/**
 * @generated from message tank.command.v1.ListMacrosRequest
 */
export type ListMacrosRequest = Message<"tank.command.v1.ListMacrosRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
};
/**
 * Describes the message tank.command.v1.ListMacrosRequest.
 * Use `create(ListMacrosRequestSchema)` to create a new message.
 */
export declare const ListMacrosRequestSchema: GenMessage<ListMacrosRequest>;
/**
 * @generated from message tank.command.v1.ListMacrosResponse
 */
export type ListMacrosResponse = Message<"tank.command.v1.ListMacrosResponse"> & {
    /**
     * @generated from field: repeated tank.command.v1.Macro macros = 1;
     */
    macros: Macro[];
};
/**
 * Describes the message tank.command.v1.ListMacrosResponse.
 * Use `create(ListMacrosResponseSchema)` to create a new message.
 */
export declare const ListMacrosResponseSchema: GenMessage<ListMacrosResponse>;
/**
 * @generated from message tank.command.v1.SaveMacroRequest
 */
export type SaveMacroRequest = Message<"tank.command.v1.SaveMacroRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: repeated string steps = 3;
     */
    steps: string[];
    /**
     * @generated from field: bool workspace = 4;
     */
    workspace: boolean;
};
/**
 * Describes the message tank.command.v1.SaveMacroRequest.
 * Use `create(SaveMacroRequestSchema)` to create a new message.
 */
export declare const SaveMacroRequestSchema: GenMessage<SaveMacroRequest>;
/**
 * @generated from message tank.command.v1.SaveMacroResponse
 */
export type SaveMacroResponse = Message<"tank.command.v1.SaveMacroResponse"> & {
    /**
     * @generated from field: tank.command.v1.Macro macro = 1;
     */
    macro?: Macro;
};
/**
 * Describes the message tank.command.v1.SaveMacroResponse.
 * Use `create(SaveMacroResponseSchema)` to create a new message.
 */
export declare const SaveMacroResponseSchema: GenMessage<SaveMacroResponse>;
/**
 * @generated from message tank.command.v1.DeleteMacroRequest
 */
export type DeleteMacroRequest = Message<"tank.command.v1.DeleteMacroRequest"> & {
    /**
     * @generated from field: string workspace_id = 1;
     */
    workspaceId: string;
    /**
     * @generated from field: string name = 2;
     */
    name: string;
    /**
     * @generated from field: bool workspace = 3;
     */
    workspace: boolean;
};
/**
 * Describes the message tank.command.v1.DeleteMacroRequest.
 * Use `create(DeleteMacroRequestSchema)` to create a new message.
 */
export declare const DeleteMacroRequestSchema: GenMessage<DeleteMacroRequest>;
/**
 * @generated from message tank.command.v1.DeleteMacroResponse
 */
export type DeleteMacroResponse = Message<"tank.command.v1.DeleteMacroResponse"> & {};
/**
 * Describes the message tank.command.v1.DeleteMacroResponse.
 * Use `create(DeleteMacroResponseSchema)` to create a new message.
 */
export declare const DeleteMacroResponseSchema: GenMessage<DeleteMacroResponse>;
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
    /**
     * @generated from rpc tank.command.v1.CommandService.ListMacros
     */
    listMacros: {
        methodKind: "unary";
        input: typeof ListMacrosRequestSchema;
        output: typeof ListMacrosResponseSchema;
    };
    /**
     * @generated from rpc tank.command.v1.CommandService.SaveMacro
     */
    saveMacro: {
        methodKind: "unary";
        input: typeof SaveMacroRequestSchema;
        output: typeof SaveMacroResponseSchema;
    };
    /**
     * @generated from rpc tank.command.v1.CommandService.DeleteMacro
     */
    deleteMacro: {
        methodKind: "unary";
        input: typeof DeleteMacroRequestSchema;
        output: typeof DeleteMacroResponseSchema;
    };
}>;
