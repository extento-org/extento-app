export async function getZip(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 3 * 1000)));
    return 28204;
};