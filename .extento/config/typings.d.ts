export {};

declare module "*.css";
declare module "*.md";

declare global {
    interface Window {
        [key: string]: any;
    }
}