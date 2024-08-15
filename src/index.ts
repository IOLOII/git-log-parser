import { spawn } from 'child_process'
import through2 from 'through2'
import split2 from 'split2'
import traverse from 'traverse'
import { Transform } from 'stream'
import type stream from 'stream'
import { format as toArgv } from 'argv-formatter'
import combine from 'stream-combiner2'
import fwd from 'spawn-error-forwarder'
import { fields, mapFields } from './fields'
import split from 'split2'

var END = '==END=='
var FIELD = '==FIELD=='

function format(fieldMap): string {
  return fieldMap.map(function (field) {
    return '%' + field.key
  })
    .join(FIELD) + END
}

function trim(): stream.Transform {
  return through2(function (chunk, enc, callback) {
    if (!chunk) {
      callback()
    }
    else {
      callback(null, chunk)
    }
  })
}

function log(args: any, options: any) {
  return fwd(spawn('git', ['log'].concat(args), options), function (code: any, stderr: any) {
    return new Error('git log failed:\n\n' + stderr)
  })
    .stdout
}

function args(config: any, fieldMap: any) {
  config.format = format(fieldMap)
  return toArgv(config)
}


export function parse(config: any, options: any, fields?: any) {
  config = config || {}
  var map = mapFields(fields)
  return combine.obj([
    log(args(config, map), options),
    split(END + '\n'),
    trim(),
    through2.obj(function (chunk, enc, callback) {
      var fields = chunk.toString('utf8').split(FIELD)
      callback(null, map.reduce(function (parsed: any, field: { path: any; type: new (arg0: any) => any }, index: string | number) {
        var value = fields[index]
        traverse(parsed).set(field.path, field.type ? new field.type(value) : value)
        return parsed
      }, {}))
    })
  ])
}

export default {
  parse
}
