"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
function hello(name) {
    return `Hello, ${name}!`;
}
function goodbye(name) {
    return `Goodbye, ${name}!`;
}
const { spawn } = require('child_process');
const through = require('through2');
const split = require('split2');
const traverse = require('traverse');
const toArgv = require('argv-formatter').format;
const combine = require('stream-combiner2');
const fwd = require('spawn-error-forwarder');
var END = '==END==';
var FIELD = '==FIELD==';
function format(fieldMap) {
    return fieldMap.map(function (field) {
        return '%' + field.key;
    })
        .join(FIELD) + END;
}
function trim() {
    return through(function (chunk, enc, callback) {
        if (!chunk) {
            callback();
        }
        else {
            callback(null, chunk);
        }
    });
}
function args(config, fieldMap = {}) {
    config.format = format(fieldMap);
    return toArgv(config);
}
function log(args, options = {}) {
    return fwd(spawn('git', ['log'].concat(args), options), function (code, stderr) {
        return new Error('Error git log failed:\n\n' + stderr);
    })
        .stdout;
}
function parseLogStream(config, options = {}) {
    var map = mapf();
    return combine.obj([
        log(args(config, map), options),
        split(END + '\n'),
        trim(),
        through.obj(function (chunk, enc, callback) {
            var fields = chunk.toString('utf8').split(FIELD);
            callback(null, map.reduce(function (parsed, field, index) {
                var value = fields[index];
                traverse(parsed).set(field.path, field.type ? new field.type(value) : value);
                return parsed;
            }, {}));
        })
    ]);
}
;
function mapf() {
    return traverse.reduce(config, function (fields, node) {
        if (this.isLeaf && typeof node === 'string') {
            var typed = this.key === 'key';
            fields.push({
                path: typed ? this.parent.path : this.path,
                key: node,
                type: this.parent.node.type
            });
        }
        return fields;
    }, []);
}
;
let config = {
    commit: {
        long: 'H',
        short: 'h'
    },
    tree: {
        long: 'T',
        short: 't'
    },
    author: {
        name: 'an',
        email: 'ae',
        date: {
            key: 'ai',
            type: Date
        }
    },
    committer: {
        name: 'cn',
        email: 'ce',
        date: {
            key: 'ci',
            type: Date
        }
    },
    subject: 's',
    body: 'b'
};
module.exports = {
    hello,
    goodbye,
    parse: parseLogStream,
    config
};
