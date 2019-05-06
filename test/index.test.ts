import {test} from '@oclif/test'

import cmd = require('../src/index')

describe('atdownloader', () => {
  test
    .stdout()
    .do(() => cmd.run(['https://dogemuchwow.com/wp-content/uploads/2017/11/web-developer-doge.jpg']))
    .exit(4)
    .it('runs with invalid url')

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
