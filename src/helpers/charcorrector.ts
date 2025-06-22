export function characterChecker(s: string) {
  if (s !== null) {
      return transformUntilSpace(s);
  }

}

function transformUntilSpace(s: string) : string {
  var returnString = "";
  for (var char of s) {
    let unicode = char.charCodeAt(0);
    if (unicode >= 65 && unicode <= 90) {
      returnString += String.fromCharCode(unicode + 32);
    } else if (unicode >= 97 && unicode <= 122) {
      returnString += String.fromCharCode(unicode);
    } else if (unicode === 32) {
      return returnString;
    }
  }
  return returnString;
}

export function arrayCharacterChecker(s : string[]) :string[] {
  for (let i = s.length - 1; i >=0; i --) {
    if (s[i].includes('?')) {
      s.splice(i,1);
    }
  }
 return s;
}
