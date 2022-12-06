function method_logger<Exports>(name: string, exports: Exports): Exports {
    return new Proxy(exports, {
        get: (obj: any, prop: string) => (...args: any[]) => {
            console.info(
                `running ${name}.${prop} with args: `,
                args,
            );
            const method: Function = obj[prop];
            return method(...args);
        },
    });
};

export default method_logger;
