# Open Source Project Template

[![Release](https://img.shields.io/github/v/release/wayfair-incubator/oss-template?display_name=tag)](CHANGELOG.md)
[![Lint](https://github.com/wayfair-incubator/oss-template/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/wayfair-incubator/oss-template/actions/workflows/lint.yml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![Maintainer](https://img.shields.io/badge/Maintainer-Wayfair-7F187F)](https://wayfair.github.io)

## Before You Start

As much as possible, we have tried to provide enough tooling to get you up and running quickly and with a minimum of effort. This includes sane defaults for documentation; templates for bug reports, feature requests, and pull requests; and [GitHub Actions](https://github.com/features/actions) that will automatically manage stale issues and pull requests. This latter defaults to labeling issues and pull requests as stale after 60 days of inactivity, and closing them after 7 additional days of inactivity. These [defaults](.github/workflows/stale.yml) and more can be configured. For configuration options, please consult the documentation for the [stale action](https://github.com/actions/stale).

In trying to keep this template as generic and reusable as possible, there are some things that were omitted out of necessity and others that need a little tweaking. Before you begin developing in earnest, there are a few changes that need to be made.

- [ ] Select an appropriate license for your project. This can easily be achieved through the 'Add File' button on the GitHub UI, naming the file `LICENSE`, and selecting your desired license from the provided list.
- [ ] Update the `<License name>` placeholder in this file to reflect the name of the license you selected above
- [ ] Replace `[INSERT CONTACT METHOD]` in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) with a suitable communication channel
- [ ] Change references to `org_name` to the name of the org your repo belongs to (eg. `wayfair-incubator`)
  - [ ] In [`README.md`](README.md)
  - [ ] In [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [ ] Change references to `repo_name` to the name of your new repo
  - [ ] In [`README.md`](README.md)
  - [ ] In [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [ ] Update the link to the contribution guidelines to point to your project
  - [ ] In [`.github/ISSUE_TEMPLATE/BUG_REPORT.md`](.github/ISSUE_TEMPLATE/BUG_REPORT.md)
  - [ ] In [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)
- [ ] Replace the `<project name>` placeholder with the name of your project
  - [ ] In [`CONTRIBUTING.md`](CONTRIBUTING.md)
  - [ ] In [`SECURITY.md`](SECURITY.md)
- [ ] Add names and contact information for actual project maintainers to [`MAINTAINERS.md`](MAINTAINERS.md)
- [ ] Delete the content of [`CHANGELOG.md`](CHANGELOG.md). We encourage you to [keep a changelog](https://keepachangelog.com/en/1.0.0/).
- [ ] Replace the generic content in this file with the relevant details about your project
- [ ] Delete this section of the README

## About The Project

Provide some information about what the project is/does.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/org_name/repo_name.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com) or the [Wiki](https://github.com/org_name/repo_name/wiki)_

## Roadmap

See the [open issues](https://github.com/org_name/repo_name/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. For detailed contributing guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Distributed under the `<License name>` License. See `LICENSE` for more information.

## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email

Project Link: [https://github.com/org_name/repo_name](https://github.com/org_name/repo_name)

## Acknowledgements

This template was adapted from
[https://github.com/othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template).
