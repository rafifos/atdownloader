# [2.0.0](https://github.com/rafifos/atdownloader/compare/1.1.0...2.0.0) (2019-06-22)


### Code Refactoring

* replace node-downloader-helper with downit ([58fd084](https://github.com/rafifos/atdownloader/commit/58fd084))


### Features

* gracefully throw a error (when there is one) ([1e7c1fb](https://github.com/rafifos/atdownloader/commit/1e7c1fb))


### BREAKING CHANGES

* Replace the download engine, atm it can't show the current download speed.

# [1.1.0](https://github.com/rafifos/atdownloader/compare/1.0.0...1.1.0) (2019-05-08)


### Features

* warn user if there is an update available ([4fa7e2f](https://github.com/rafifos/atdownloader/commit/4fa7e2f))



# [1.0.0](https://github.com/rafifos/atdownloader/compare/0.0.1...1.0.0) (2019-05-08)


### Bug Fixes

* Add support for the older AT CDN ([3eed89c](https://github.com/rafifos/atdownloader/commit/3eed89c))
* Drop unused import: fs ([f9f9e9c](https://github.com/rafifos/atdownloader/commit/f9f9e9c))
* Exit on errors and on download completion ([150ac64](https://github.com/rafifos/atdownloader/commit/150ac64))
* Fix default destination path on Windows ([7c49707](https://github.com/rafifos/atdownloader/commit/7c49707))


### Code Refactoring

* Increase verbosity by default. ([1f67cf3](https://github.com/rafifos/atdownloader/commit/1f67cf3))
* Major code refactoring ([5e9454c](https://github.com/rafifos/atdownloader/commit/5e9454c))


### BREAKING CHANGES

* This drops the flag `--verbose`. This also drops dependency on `winston`.
* Now, episodes will be downloaded to $HOME/ATDownloader by default.



# 0.0.2 (2019-04-26)


### Bug Fixes

* Exit on errors and on download completion ([150ac64](https://github.com/rafifos/atdownloader/commit/150ac64))
* Fix default destination path on Windows ([7c49707](https://github.com/rafifos/atdownloader/commit/7c49707))


### Code Refactoring

* Improve download workflow ([88949b2](https://github.com/rafifos/atdownloader/commit/88949b2))


### Documentation

* **README:** Include additional badges for Depfu and LGTM ([3247d04](https://github.com/rafifos/atdownloader/commit/3247d04))


### Build

* Delete tsc output directory if it exists before publishing ([3aaf24d](https://github.com/rafifos/atdownloader/commit/3aaf24d))


### Chores

* **bot:** Initial release-drafter configuration ([72afd96](https://github.com/rafifos/atdownloader/commit/72afd96))



# 0.0.1 (2019-04-26)


* This is the initial release on npm.
