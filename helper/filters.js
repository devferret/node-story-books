module.exports = {
  truncate: (str, len) => {
    if (str.length > 0 && str.length > len) {
      return str.substr(0, len) + '...'
    }
    return str
  },
  stripTags: input => {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  }
}