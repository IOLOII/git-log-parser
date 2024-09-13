declare function parseLogStream(config: any, options?: object, fields?: any): any;
export declare const parse: typeof parseLogStream;
export declare let fields: {
    commit: {
        long: string;
        short: string;
    };
    tree: {
        long: string;
        short: string;
    };
    author: {
        name: string;
        email: string;
        date: {
            key: string;
            type: DateConstructor;
        };
    };
    committer: {
        name: string;
        email: string;
        date: {
            key: string;
            type: DateConstructor;
        };
    };
    subject: string;
    body: string;
};
declare const _default: {
    parse: typeof parseLogStream;
    fields: {
        commit: {
            long: string;
            short: string;
        };
        tree: {
            long: string;
            short: string;
        };
        author: {
            name: string;
            email: string;
            date: {
                key: string;
                type: DateConstructor;
            };
        };
        committer: {
            name: string;
            email: string;
            date: {
                key: string;
                type: DateConstructor;
            };
        };
        subject: string;
        body: string;
    };
};
export default _default;
