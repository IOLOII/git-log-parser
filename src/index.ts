import { spawn } from 'child_process'
import through from 'through2'
import split from 'split2'
import traverse from 'traverse'
const toArgv = require('argv-formatter').format
import combine from 'stream-combiner2'
import fwd from 'spawn-error-forwarder'

var END = '==END=='
var FIELD = '==FIELD=='

function format(fieldMap: Array<any>): string {
  return fieldMap.map(function (field: any) {
    return '%' + field.key
  })
    .join(FIELD) + END
}

function trim() {
  return through(function (chunk: any, enc: string, callback: Function) {
    if (!chunk) {
      callback()
    }
    else {
      callback(null, chunk)
    }
  })
}

function args(config: any, fieldMap: Array<any>) {
  config.format = format(fieldMap)
  return toArgv(config)
}

function log(args: Array<string>, options: object = {}) {
  return fwd(spawn('git', ['log'].concat(args), options), function (code: any, stderr: any) {
    return new Error('Error git log failed:\n\n' + stderr)
  })
    .stdout
}

function parseLogStream(config: any, options: object = {}, fields?: any) {
  var map = mapFields(fields)

  return combine.obj([
    log(args(config, map), options),
    split(END + '\n'),
    trim(),
    through.obj(function (chunk: any, enc: any, callback: any) {
      var fields = chunk.toString('utf8').split(FIELD)
      callback(null, map.reduce(function (parsed: any, field: any, index: any) {
        var value = fields[index]
        traverse(parsed).set(field.path, field.type ? new field.type(value) : value)
        return parsed
      }, {}))
    })
  ])
};

function mapFields(fields = _fields) {
  return traverse.reduce(fields, function (this: any, fields: Array<any>, node: object) {
    if (this.isLeaf && typeof node === 'string') {
      var typed = this.key === 'key'
      fields.push({
        path: typed ? this.parent.path : this.path,
        key: node,
        type: this.parent.node.type
      })
    }
    return fields
  }, [])
};

let _fields = {
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
}
export const parse = parseLogStream
export let fields = new Proxy(_fields, {
  get: () => fields,
  set: function (value) {
    fields = value
    return true
  }
})
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
