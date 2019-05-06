import {test} from '@oclif/test'

import cmd = require('../src/index')

describe('atdownloader', () => {
  test
    .stdout()
    .do(() => cmd.run(['https://dogemuchwow.com/wp-content/uploads/2017/11/web-developer-doge.jpg']))
    .exit(4)
    .it('runs with invalid url')

  test
    .stdout()
    .do(() => cmd.run(['https://twist.moe/a/boku-no-pico/1']))
    .exit(0)
    .it('downloads a old anime')

  test
    .stdout()
    .do(() => cmd.run(['https://twist.moe/a/mob-psycho-100-ii/1']))
    .exit(0)
    .it('downloads a new anime')

  /*
   * This contains an example of a test.
   * test
   *   .stdout()
   *   .do(() => cmd.run(['--name', 'jeff']))
   *   .it('runs with invalid url', ctx => {
   *     expect(ctx.stdout).to.contain('hello jeff')
   *   })
   */
})
