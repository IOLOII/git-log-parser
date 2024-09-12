"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { parse } = require('./index');
const { describe, expect, test } = require('@jest/globals');
describe('parse', () => {
    test('should parse git log', async () => {
        await new Promise((resolve, reject) => {
            parse({
            // after: new Date(['2024-08-4', '2024-08-5'][0]),
            // before: new Date(['2024-08-4', '2024-08-5'][1])
            }, {
                cwd: './'
                // env: env
            })
                .on('data', function (data) {
                console.log(data);
            })
                .on('error', (e) => {
                console.error(e);
                reject();
            })
                .on('end', () => {
                console.log('end');
                resolve();
            });
        });
        expect(true).toBe(true);
    });
});
