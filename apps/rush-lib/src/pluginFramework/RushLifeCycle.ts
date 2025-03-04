// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { AsyncSeriesHook, HookMap } from 'tapable';

/**
 * Information about the currently executing command provided to plugins.
 * @beta
 */
export interface IRushCommand {
  /**
   * The name of this command, as seen on the command line
   */
  readonly actionName: string;
}

/**
 * Information about the currently executing global script command (as defined in command-line.json) provided to plugins.
 * @beta
 */
export interface IGlobalCommand extends IRushCommand {
  // Nothing added.
}

/**
 * Information about the currently executing phased script command (as defined in command-line.json, or default "build" or "rebuild") provided to plugins.
 * @beta
 */
export interface IPhasedCommand extends IRushCommand {
  // Will add hooks once the API surface is finalized
}

/**
 * Hooks into the lifecycle of the Rush process invocation that plugins may tap into.
 *
 * @beta
 */
export class RushLifecycleHooks {
  /**
   * The hook to run before executing any Rush CLI Command.
   */
  public initialize: AsyncSeriesHook<IRushCommand> = new AsyncSeriesHook<IRushCommand>(
    ['command'],
    'initialize'
  );

  /**
   * The hook to run before executing any global Rush CLI Command (defined in command-line.json).
   */
  public runAnyGlobalCustomCommand: AsyncSeriesHook<IGlobalCommand> = new AsyncSeriesHook<IGlobalCommand>(
    ['command'],
    'runAnyGlobalCustomCommand'
  );

  /**
   * A hook map to allow plugins to hook specific named global commands (defined in command-line.json) before execution.
   */
  public runGlobalCustomCommand: HookMap<AsyncSeriesHook<IGlobalCommand>> = new HookMap((key: string) => {
    return new AsyncSeriesHook<IGlobalCommand>(['command'], key);
  }, 'runGlobalCustomCommand');

  /**
   * The hook to run before executing any phased Rush CLI Command (defined in command-line.json, or the default "build" or "rebuild").
   */
  public runAnyPhasedCommand: AsyncSeriesHook<IPhasedCommand> = new AsyncSeriesHook<IPhasedCommand>(
    ['command'],
    'runAnyPhasedCommand'
  );

  /**
   * A hook map to allow plugins to hook specific named phased commands (defined in command-line.json) before execution.
   */
  public runPhasedCommand: HookMap<AsyncSeriesHook<IPhasedCommand>> = new HookMap((key: string) => {
    return new AsyncSeriesHook<IPhasedCommand>(['command'], key);
  }, 'runPhasedCommand');
}
