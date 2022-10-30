export function getCookieValue(cookie, name) {
     function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
     var match = cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
     return match ? match[1] : null;
}