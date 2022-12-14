const retryOnThrow = (opts: {
    fn: any,
    delay: number,
    attempt?: number,
    on_error?: (err: Error, attempt: number) => unknown,
}) => {
    try {
        opts.fn(opts);
    } catch (err) {
        opts?.on_error(err, opts.attempt || 0);

        setTimeout(() => retryOnThrow({
            ...opts,
            attempt: (opts.attempt || 0) + 1,
        }), opts.delay);
    }
};

export default retryOnThrow;
