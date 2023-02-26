export function nthIndex(str, pat, n) {
  var L = str.length,
    i = -1
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i)
    if (i < 0) break
  }
  return i
}

export function extractPartNumberFromPath(string) {
  // Assumes path is formatted /part-[num] or /part-[num]/...
  const subpartSeperator = nthIndex(string, "/", 2)
  if (subpartSeperator !== -1) {
    string = string.substring(0, subpartSeperator)
  }
  return parseInt(string.substring(string.indexOf("-") + 1))
}

export function extractSubpartNumberFromPath(string) {
  // Assumes path is formatted /part-[num]/[num]-...
  return parseInt(
    string.substring(nthIndex(string, "/", 2) + 1, nthIndex(string, "-", 2)),
  )
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function removeLeadingZeros(string) {
  return string.replace(/^0+/, "")
}

export function splitGroupNameToWordAndNumber(string) {
  return string.split(/(\d+)/)
}

export function improveGroupName(string) {
  var stringParts = splitGroupNameToWordAndNumber(string)
  return (
    capitalizeFirstLetter(stringParts[0]) +
    " " +
    removeLeadingZeros(stringParts[1])
  )
}

export function normalizeExerciseId(string) {
  return encodeURIComponent(
    string
      .toLowerCase()
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ä/g, "a")
      .replace(/Ä/g, "A")
      .replace(/\s+/g, "-")
      .replace(/[^A-Za-z0-9_-]/g, "")
      .replace(/-+/g, "-"),
  )
}
