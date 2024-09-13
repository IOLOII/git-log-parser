import { spawn } from 'child_process';
import through from 'through2';
import split from 'split2';
import traverse from 'traverse';
import argvFormatter from 'argv-formatter';
import combine from 'stream-combiner2';
import fwd from 'spawn-error-forwarder';
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
function args(config, fieldMap) {
    config.format = format(fieldMap);
    return argvFormatter.format(config);
}
function log(args, options) {
    if (options === void 0) { options = {}; }
    return fwd(spawn('git', ['log'].concat(args), options), function (code, stderr) {
        return new Error('Error git log failed:\n\n' + stderr);
    })
        .stdout;
}
function parseLogStream(config, options, fields) {
    if (options === void 0) { options = {}; }
    var map = mapFields(fields);
    return combine.obj([
        log(args(config, map), options),
        split(END + '\n'),
        trim(),
        through.obj(function (chunk, enc, callback) {
            var fields = chunk.toString('utf8').split(FIELD);
            callback(null, map.reduce(function (parsed, field, index) {
                var value = fields[index];
                traverse(parsed).set(field.path, field.type ? new field.type(value).toString() : value);
                return parsed;
            }, {}));
        })
    ]);
}
;
function mapFields(fields) {
    if (fields === void 0) { fields = _fields; }
    return traverse.reduce(fields, function (fields, node) {
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
var _fields = {
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
export var parse = parseLogStream;
export var fields = new Proxy(_fields, {
    get: function () { return fields; },
    set: function (value) {
        fields = value;
        return true;
    }
});
// module.exports = {
//   parse: parseLogStream,
//   fields: new Proxy(fields, {
//     get: () => fields,
//     set: function (value) {
//       fields = value
//       return true
//     }
//   })
// }
export default {
    parse: parseLogStream,
    fields: fields
};
//# sourceMappingURL=index.js.map