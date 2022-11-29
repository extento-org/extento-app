const retry_on_throw = (opts: {
    fn: any,
    delay: number,
    attempt?: number,
    on_error?: (err: Error, attempt: number) => unknown,
}) => {
    try {
        opts.fn(opts);
    } catch(err) {
        opts?.on_error(err, opts.attempt || 0);

        setTimeout(() => retry_on_throw({
            ...opts,
            attempt: (opts.attempt || 0) + 1,
        }), opts.delay);
    }
};

export default retry_on_throw;
