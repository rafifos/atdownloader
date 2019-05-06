import {Command, flags} from '@oclif/command'
import * as cheerio from 'cheerio'
import * as makeDir from 'make-dir'
import {DownloaderHelper} from 'node-downloader-helper'
import * as os from 'os'
import * as path from 'path'
import * as puppeteer from 'puppeteer'
import * as winston from 'winston'

// Must be declared globaly.
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.label({label: 'atdownloader'}),
    winston.format.timestamp(),
    winston.format.printf(({level, message, label}) => {
      return `[${label}] ${level}: ${message}`
    })
  )
})

const Ora = require('ora')

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
    }),
    verbose: flags.boolean({
      char: 'v',
      default: false
    })
  }

  async run() {
    let {args, flags} = this.parse(ATDownloader)
    let destination: string = flags.destination || ATDownloader.defaultDestination

    if (flags.verbose) {
      logger.silent = !flags.verbose || false
    }

    await makeDir(destination)
      .catch(err => {
        logger.error(`An error ocurred when trying to create a directory: ${err}`)
        this.exit(3)
      })

    if (!args.url.match(ATDownloader.baseUrl)) {
      logger.error("URL isn't from Anime Twist, exiting.")
      this.exit(4)
    }

    let downloadLink = await this.getDownloadLink(args.url)
    logger.info(`Link found: ${downloadLink}`)

    let spinner = new Ora({
      text: 'Starting download...',
      color: 'green'
    })

    spinner.start()

    let oldFilename: string = downloadLink.substring(downloadLink.lastIndexOf('/') + 1)
    let newFilename: string = oldFilename.replace(/%20/g, ' ')

    let dl = new DownloaderHelper(downloadLink, destination, {fileName: newFilename, override: true})

    // tslint:disable-next-line: no-floating-promises
    dl
      .on('end', () => {
        spinner.succeed('Download completed.')
      })
      .on('error', err => {
        spinner.fail(`Download failed: ${err}`)
        this.exit(6)
      })
      .on('progress', stats => {
        spinner.text = 'Downloading: ' + this.byteHelper(stats.downloaded) + '/' + this.byteHelper(stats.total) + ' | ' + this.byteHelper(stats.speed) + '/s' + ' | ' + stats.progress.toFixed(1) + '%'
      })
      .start()
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
      logger.error('There was an error on the scraping process: ', err)
      this.exit(5)
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
