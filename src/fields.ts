import traverse from "traverse"

export let fields = {
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

export const mapFields = (_config = fields) => {
  return traverse.reduce(_config, (fields, node) => {
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
}
