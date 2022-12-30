export type State = {
    field: string
};

const initial: State = {
    field: 'add possible ui states in this file'
};

export type Other = {
    first: string,
    second: string,
};

const other: Other = {
    first: 'otherfield',
    second: 'hmmm'
};

export default {
    initial,
    other,
};
