# GECOPA Admin

    Does the administration of GECOPA. (Forked from
    https://github.com/Foxandxss/angular-webpack-workflow.git)


# Table of Contents

* [Getting Started](#getting-started)
    * [Dependencies](#dependencies)
    * [Installing](#installing)
    * [Running the app](#running-the-app)
    * [Developing](#developing)
    * [Testing](#testing)
* [Release Notes](#release-notes)

# Getting Started

## Dependencies

What you need to run this app:
* `node` and `npm` (Use [NVM](https://github.com/creationix/nvm))
* Ensure you're running Node (`v4.1.x`+) and NPM (`2.14.x`+)

## Installing

* `npm install` to install all dependencies

## Running the app

After you have installed all dependencies you can now run the app with:
```bash
npm start
```

It will start a local server using `webpack-dev-server` which will watch, build
(in-memory), and reload for you. The port will be displayed to you as
`http://localhost:8080`.

## Developing

### Build files

* single run: `npm run build`
* build files and watch: `npm run watch`

## Testing

#### 1. Unit Tests

* single run: `npm test`
* live mode (TDD style): `npm run test-watch`

# Release Notes

## 1.0.0

    user login
        => only the token is stored, no user information (DONE)
        => token expires in 3 days (DONE)
        => verify the admin role (set via settings) (DONE)
        => handle users from RTBF

    drawing of lots

    list of concours
        => not yet into material
            => make better table
              checkout http://codepen.io/jbltx/pen/WbdRRb/

    creation of concours
    creation of concours from copy
    update concours
    delete concours

    preferences
        update preferences (DONE)

    settings
        update settings

    concours image
        check mime type, not based on suffix (DONE)
        resize image to 135x85

    concours screen date visualisation
        => dd/mm/yyyy
