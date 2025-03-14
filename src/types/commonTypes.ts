import { PromiseStates, HTTPMethods, KeyboardEvents } from '../const/common';

export type TPromiseState = keyof typeof PromiseStates;
export type THTTPMethods = keyof typeof HTTPMethods;
export type TKeyboardEvents = keyof typeof KeyboardEvents;
export type Timeout = ReturnType<typeof setTimeout>;
export type TTextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
