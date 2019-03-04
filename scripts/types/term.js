'use strict'

function Term (name, data) {
  Entry.call(this, name, data)

  this.parent = null // From Ø('map')
  this.children = [] // From Ø('map')
  this.logs = [] // From Ø('map')
  this.issues = [] // From Ø('map')
  this.diaries = [] // From Ø('map')
  this.span = { from: null, to: null }
  this.featuredLog = null // From Ø('map')

  this.data = data
  this.pict = data.PICT ? data.PICT : 0
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.view = data.VIEW ? data.VIEW.toLowerCase() : 'main'
  this.theme = data.LOOK ? data.LOOK : null
  this.tags = data.TAGS ? data.TAGS.toLowerCase().split(' ') : []
  this.indexes = data.ALTS ? [name].concat(data.ALTS.split(' ')) : [name]
  this.theme = data.LOOK ? data.LOOK.toLowerCase() : 'blanc'
  this.is_portal = this.tags.indexOf('portal') > -1

  this.glyph = function () {
    if (this.data.ICON) { return this.data.ICON }
    if (this.parent.glyph()) { return this.parent.glyph() }
    if (this.portal().glyph()) { return this.portal().glyph() }
    return null
  }

  this.photo = function () {
    if (this.pict) { return this.pict }
    if (this.featuredLog && this.featuredLog.pict) { return this.featuredLog.pict }
    return 0
  }

  this.portal = function () {
    if (this.is_portal) { return this }
    if (this.parent.is_portal) { return this.parent }
    if (this.parent.parent.is_portal) { return this.parent.parent }
    if (this.parent.parent.parent.is_portal) { return this.parent.parent.parent }
    if (this.parent.parent.parent.parent.is_portal) { return this.parent.parent.parent.parent }
    return null
  }

  this.activity = function () {
    return sortLogs(this.children.reduce((acc, term) => { return acc.concat(term.logs) }, this.logs))
  }

  this.rating = function () {
    const points = {
      body: this.data.BODY && this.data.BODY.length > 0,
      logs: this.logs.length > 0,
      children: this.children.length > 0,
      photo: this.diaries.length > 0,
      outgoing: this.outgoing && this.outgoing.length > 1,
      incoming: this.incoming && this.incoming.length > 1,
      glyph: this.glyph() !== '',
      issues: this.issues.length === 0,
      tags: this.tags.length > 0
    }

    const score = Object.keys(points).reduce((acc, val) => { return acc + (points[val] ? 1 : 0) }, 0)
    return score / Object.keys(points).length
  }

  this.body = function () {
    return `${runic(this.data.BODY, this)}`
  }

  this._photo = function () {
    return this.featuredLog ? `<a data-goto='${this.name}'><img src="media/diary/${this.featuredLog.pict}.jpg"/></a>` : ''
  }

  this.toString = function (photo = false) {
    return `<h2>${this.name.toTitleCase()}</h2><h4>${this.bref}</h4>${photo === true ? this._photo() : ''}${this.body()}`
  }
}
