/* eslint-disable */
/**
 * Generated Convex server types stub
 */

import type { GenericQueryCtx, GenericMutationCtx, GenericActionCtx } from "convex/server";
import type { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;

// Re-export query/mutation/action builders
export { query, mutation, action, internalQuery, internalMutation, internalAction } from "convex/server";
