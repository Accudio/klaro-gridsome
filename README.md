# klaro-gridsome

Wrapper for [Klaro! cookie consent manager](https://github.com/KIProtect/klaro) for easy use in [Gridsome](https://github.com/gridsome/gridsome) projects.

## Install

```npm install klaro-gridsome```

## Usage

Include in `plugins` in gridsome.config.js

```js
module.exports = {
  plugins: [
    {
      use: 'klaro-gridsome',
      options: {
        // your klaro configuration here
      }
    }
  ]
}
```

Populates klaroConfig and accepts the same configuration. See [klaro's config.js](https://github.com/KIProtect/klaro/blob/master/dist/config.js) for a sample configuration.

### Example

```js
module.exports = {
  plugins: [
    {
      use: 'klaro-gridsome',
      options: {
        privacyPolicy: '/privacy-policy/',
        cookieName: 'consent',
        translations: {
          en: {
            consentModal: {
              description: 'Here you can see and customize the information that we collect about you.',
            },
            googleAnalytics: {
              description: 'Website analytics powered by Google Analytics, allowing us to see how visitors use our website.'
            },
            purposes: {
              analytics: 'Analytics'
            },
          },
        },
        apps: [
          {
            name: 'googleAnalytics',
            default: true,
            title: 'Google Analytics',
            purposes: ['analytics'],
            cookies: [
              '_ga',
              '_gcl_au',
              '_gid',
              '_gat'
            ],
            required: false,
            optOut: true,
            onlyOnce: false
          }
        ]
      }
    }
  ]
}
```

### Reading Consent

Klaro normally handles opting in/out of tracking by relying upon new page loads and by replacing the type of script elements. With a framework like Vue, this has to be handled manually.

Whenever consent is changed the `consentUpdate` event is fired on the document with the update. You can use this to listen to a change and respond accordingly. The `event.detail` object will include the app name changed, and a boolean consent property showing the current opt-in/opt-out value.

#### Example

```js
export default {
  mounted() {
    document.addEventListener('consentUpdate', this.consentToggle)
  },
  beforeDestroy() {
    document.removeEventListener('consentUpdate', this.consentToggle)
  },
  methods: {
    consentToggle(event) {
      // only is app is google analytics
      if (event.detail.app === 'googleAnalytics') {
        if (event.detail.consent) {
          // if user consent is true
          this.$ga.enable()
        } else {
          // if user consent is false
          this.$ga.disable()
        }
      }
    }
  }
}
```

### Reading consent on first load

As the `consentUpdate` event is only fired on a change, you will need to make sure you check Klaro consent before enabling any tracking. This can be done with `window.klaro.getManager().consents`, which includes the current state of all consents.

#### Example

```js
Vue.use(VueAnalytics, {
  disabled: () => {
    return !window.klaro.getManager().consents.googleAnalytics
  }
})
```

## Version History

- v1.0.3  - Reverted process.isClient check, still seems to be required in certain cases
- v1.0.1  - Removed redundant process.isClient check
- v1.0.0  - Initial public release, based on Klaro v0.3.2

## Credits

- [Gridsome Static Site Generator](https://github.com/gridsome/gridsome)
- [Klaro! Cookie Consent Manager](https://github.com/KIProtect/klaro)

## License

Klaro copyright and License in klaro/LICENSE.

Copyright &copy; 2020 [Alistair Shepherd](https://alistairshepherd.uk). Licensed under the [MPL-2.0 License](https://www.mozilla.org/en-US/MPL/2.0/).
