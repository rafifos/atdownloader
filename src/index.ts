import { Command, flags } from '@oclif/command'
import { createLogger, format, transports } from 'winston'
import { DownloaderHelper } from 'node-downloader-helper'
import * as tempy from 'tempy'
import * as puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

const Ora = require('ora')
const { combine, label, timestamp, printf } = format

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const baseUrl = 'https://twist.moe'

/*
 * Function created by hgouveia, modified by rafifos.
 * The original source code can be found at: https://github.com/hgouveia/node-downloader-helper/blob/0b3f2e42d72bdc24ab0889a8954161d239659fb6/example/helpers.js#L4
 */
function byteHelper(value:any) {
  // https://gist.github.com/thomseddon/3511330
  let units = ['b', 'kB', 'MB', 'GB', 'TB']
  let number = Math.floor(Math.log(value) / Math.log(1024));
  return (value / Math.pow(1024, Math.floor(number))).toFixed(1) + ' ' + units[number];
}

class Atdownloader extends Command {
  static description = 'Download anime from Anime Twist'
  static flags = {
    dest: flags.string({
      char: 'd',
      description: 'Destination folder',
      default: process.env.HOME + '/Downloads'
    }),
    verbose: flags.boolean({
      char: 'v',
      default: false
    })
  }
  static args = [
    {
      name: 'url',
      required: true,
      description: 'twist.moe URL'
    }
  ]

  async getDownloadLink(url: string) {
    // TODO: Treat errors beautifully
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    await page.goto(url)

    let content = await page.content()
    var $ = await cheerio.load(content)

    browser.close()

    return baseUrl + $('video').attr('src')
  }

  async run() {
    const { args, flags } = this.parse(Atdownloader)

    const logger = createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
      },
      level: 'verbose',
      transports: [
        new transports.File({ filename: tempy.file({ extension: 'log' }) }),
        new transports.Console()
      ],
      format: combine(
        label({ label: 'atdownloader' }),
        timestamp(),
        logFormat
      ),
      silent: !flags.verbose || false
    })

    var dest:string = flags.dest || process.env.HOME + '/Downloads'

    if (!args.url.match(baseUrl)) {
      logger.info('Invalid url. Exiting...')
      this.exit(1)
    }

    const downloadLink = await this.getDownloadLink(args.url)
    logger.info(`Link found: ${downloadLink}`)

    const spinner = new Ora({
      text: 'Downloading',
      color: 'green'
    })

    logger.info('Download started.')
    spinner.start()
    const dl = new DownloaderHelper(downloadLink, dest)
    dl.on('progress', (stats) => {
      spinner.text = 'Downloading: ' + byteHelper(stats.downloaded) + '/' + byteHelper(stats.total) + ' | ' + byteHelper(stats.speed) + '/s' + ' | ' + stats.progress.toFixed(1) + '%'
    })
    dl.on('error', (err) => logger.error(`Download failed: ${err}`))
    dl.on('end', () => logger.info('Download completed.'))
    dl.start()
  }
}

export = Atdownloader
