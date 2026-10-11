const content = "const CACHE_VERSION = 'v1.2.2';";
const regex = /(const CACHE_VERSION = ')v[\d.]+(';)/i;
const version = "2.7.2";
const replacement = `$1v${version}$2`;
console.log("Regex string:", regex.toString());
console.log("Match:", content.match(regex));
console.log("Result:", content.replace(regex, replacement));
