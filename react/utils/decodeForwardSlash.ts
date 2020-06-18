/**
 * Decode all "/" by using $2F instead of %2F
 * Since "/" is a special character in URL, it can not be encoded normally,
 * @export
 * @param {string} str
 * @returns {string}
 */
const decodeForwardSlash = (str: string) => {
  return str.replace(/\$2F/gi, "/")
}

export default decodeForwardSlash
