import type { configDefault } from "./default";
import { configJK } from "./jk";

export type Config = typeof configDefault;

export const config = configJK;
