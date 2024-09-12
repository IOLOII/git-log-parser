declare const spawn: any;
declare const through: any;
declare const split: any;
declare const traverse: any;
declare const toArgv: any;
declare const combine: any;
declare const fwd: any;
declare var END: string;
declare var FIELD: string;
declare function format(fieldMap: Array<any>): string;
declare function trim(): any;
declare function args(config: any, fieldMap: Array<any>): any;
declare function log(args: Array<string>, options?: object): any;
declare function parseLogStream(config: any, options: object | undefined, fields: any): any;
declare function mapFields(_fields?: {
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
}): any;
declare let fields: {
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
