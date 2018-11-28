import { Duplex } from 'stream'

export default (Superagent) => {
  for(let k in Superagent.parse) {
    Superagent.parse[`old-${k}`] = Superagent.parse[k]
    Superagent.parse[k] = (res, fn) => {
      // prepend cached data and pass on the stream
      const newRes = new Duplex()
      newRes.write(this.previousBuffer) // 'this' isn't defined here, so this needs fixing
      res.pipe(newData)
      Superagent.parse[`old-${k}`](newRes, fn)
    }
  }

  Superagent.Request.prototype.originalEnd = Superagent.Request.prototype._end
  Superagent.Request.prototype._end = function() {
    console.log('finished', this.res.text)
    return this.originalEnd()
  }
  Superagent.Request.prototype.oldShouldRetry = Superagent.Request.prototype._shouldRetry
  Superagent.Request.prototype._shouldRetry = function() {
    const internalShouldRetry = this.oldShouldRetry(...arguments)
    if(internalShouldRetry) return true

    if(!this.previousBuffer) {
      this.previousBuffer = ''
    }
    this.previousBuffer = this.previousBuffer.concat(this.res.text)

    if(this.previousBuffer.length < this.res.headers['content-length']) {
      this.set('Range', `${this.previousBuffer.length}-`) //try to get the rest of it this time
      return true
    }
    return false
  }
}
