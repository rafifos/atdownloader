require('pretty-error').start()

import {Command, flags} from '@oclif/command'
import * as cheerio from 'cheerio'
import * as makeDir from 'make-dir'
import * as os from 'os'
import * as path from 'path'
import * as puppeteer from 'puppeteer'

const downit = require('downit')
const Ora = require('ora')

const spinner = new Ora({
  color: 'green'
})

class ATDownloader extends Command {
  static readonly args = [
    {
      name: 'url',
      required: true,
      description: 'twist.moe URL'
    }
  ]

  static readonly baseUrl: string = 'https://twist.moe'

  static readonly defaultDestination: string = path.join((process.env.HOME || os.tmpdir()), 'ATDownloader')

  static readonly description = 'Download anime from Anime Twist'

  static readonly flags = {
    destination: flags.string({
      char: 'd',
      description: 'Destination folder',
      default: ATDownloader.defaultDestination
    })
  }

  async run() {
    let {args, flags} = this.parse(ATDownloader)
    let destination: string = flags.destination || ATDownloader.defaultDestination

    spinner.start()

    spinner.text = 'Creating download directory'
    await makeDir(destination)
      .catch(err => {
        spinner.fail(`An error ocurred when trying to create a directory: ${err}`)
        this.exit()
      })

    spinner.text = 'Validating URL'
    if (!args.url.match(ATDownloader.baseUrl)) {
      spinner.fail('Invalid URL, exiting.')
      this.exit()
    }

    spinner.text = 'Finding direct download link'
    let downloadLink = await this.getDownloadLink(args.url)
    spinner.text = `Link found: ${downloadLink}`

    let filename: string = downloadLink.substring(downloadLink.lastIndexOf('/') + 1).replace(/%20/g, ' ')

    spinner.text = 'Downloading'
    downit(downloadLink, destination + '/' + filename, {
      onprogress: (progress: number, size: number) => {
        let percent: string = (progress / size * 100).toFixed(1)
        spinner.text = `Downloading: ${this.byteHelper(progress)} / ${this.byteHelper(size)} | ${percent}%`
      }
    })
      .then(() => spinner.succeed(`Download completed. Your file is located at: ${path.join(destination, filename)}`))
      .catch((err: any) => {
        spinner.fail(`Download failed: ${err}`)
        this.exit()
      })
  }

  /*
   * Function created by hgouveia, modified by rafifos.
   * The original source code can be found at: https://github.com/hgouveia/node-downloader-helper/blob/0b3f2e42d72bdc24ab0889a8954161d239659fb6/example/helpers.js#L4
   */
  byteHelper(value: number): string {
    // https://gist.github.com/thomseddon/3511330
    let units = ['b', 'kB', 'MB', 'GB', 'TB']
    let number = Math.floor(Math.log(value) / Math.log(1024))
    return (value / Math.pow(1024, Math.floor(number))).toFixed(1) + ' ' + units[number]
  }

  /*
   * Crawls the URL, and returns the href attribute from the first <video> tag
   * found.
   */
  async getDownloadLink(url: string): Promise<string> {
    // Creates a headless Chromium instance.
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.goto(url)

    let content = await page.content()

    let $ = await cheerio.load(content)

    /*
     * Kills the headless Chromium instance after loading the page contents into
     * cheerio.
     */
    browser.close().catch(err => {
      spinner.fail(`Couldn't find a direct download link: ${err}`)
      this.exit()
    })

    let downloadLink: string = $('video').attr('src').replace(/ /g, '%20')

    if (downloadLink.indexOf('https') > -1) {
      return downloadLink
    } else {
      return (ATDownloader.baseUrl + $('video').attr('src')).replace(/ /g, '%20')
    }
  }
}

export = ATDownloader
