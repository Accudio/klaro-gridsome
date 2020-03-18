module.exports = function(api, options) {
  if (process.isClient) {
    const klaroConfig = options
    if (klaroConfig.apps) {
      klaroConfig.apps = klaroConfig.apps.map(function(app) {
        return {
          ...app,
          callback: function(consent, app) {
            document.dispatchEvent(new CustomEvent('consentUpdate', {
              detail: {
                app: app.name,
                consent
              }
            }))
          },
        }
      })
    }

    window.klaroConfig = klaroConfig
    window.klaro = require('./klaro/klaro.js')
  }
}
