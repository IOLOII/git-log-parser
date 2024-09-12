let { parse, fields } = require('./index')

const { describe, expect, test } = require('@jest/globals')
describe('parse', () => {
  test('should parse git log', async () => {
    fields = {
      commit: {
        long: 'H',
        short: 'h'
      },
    }
    await new Promise<void>((resolve, reject) => {
      parse({
        // after: new Date(['2024-08-4', '2024-08-5'][0]),
        // before: new Date(['2024-08-4', '2024-08-5'][1])
      },
        {
          cwd: './'
        }, fields)
        .on('data', function (data: any) {
          console.log(data)
        })
        .on('error', (e: any) => {
          reject()
        })
        .on('end', () => {
          resolve()
        })
    })
    expect(true).toBe(true)
  })
}
)
