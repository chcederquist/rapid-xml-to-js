export function xmlToJs(xml: string) {
  const o: any = {};
  let cur = o;
  let curName = ''
  let curContentList: [number,number][] = [];
  let hasContent = false;
  const xmlLength = xml.length;
  for (let i = 0; i < xmlLength; i++) {
    if (xml.charCodeAt(i) === 60 /* < */) { // Inside an opening or closing tag
      if (xml.charCodeAt(i + 1) === 47 /* / */) { // Inside a closing tag
        cur = cur.__parent;
        if (hasContent) { // Insert content instead of current object
          if (cur[curName] instanceof Array) {
            const lastIdx = cur[curName].length - 1;

            cur[curName][lastIdx]['#text'] = ''
            for (let i = 0; i < curContentList.length; i++) {
              let curContent = curContentList[i];
              cur[curName][lastIdx]['#text'] += xml.slice(curContent[0], curContent[1]);
            }
          } else {
            cur[curName]['#text'] = '';            
            for (let i = 0; i < curContentList.length; i++) {
              let curContent = curContentList[i];
              cur[curName]['#text'] += xml.slice(curContent[0], curContent[1]);
            }
          }
        }
        i = xml.indexOf('>', i);
        curName = '';
      } else if ((xml.charCodeAt(i + 1) === 63 /* ? */ || xml.charCodeAt(i + 1) === 33 /* ! */)) { // Ignore processing instructions, stylesheets, DTD validation,
        if (xml.charCodeAt(i + 1) === 33 /* ! */) {
          // Handle declarations
          // TODO: Create skipUntil utility function
          if (xml.startsWith('<!DOCTYPE', i)) { // Doctype
            i+=9;
            i = xml.indexOf('>', i);
          } else if (xml.startsWith('<!--', i)) { // Comment
            i+= 4;
            i = xml.indexOf('-->', i) + 2;
          } else if (xml.startsWith('<![CDATA[', i)) { // Handle CDATA
            i+= 9;
            let contentFrom = i;
            i = xml.indexOf(']]>', i);
            let contentTo = i;
            curContentList.push([contentFrom, contentTo]);
            i+=2;
            hasContent = true;
            continue; // Skip hasContent = false 
          }
        } else {
          // Ignore processing instructions and stylesheets
          i = xml.indexOf('>', i);
        }
        
      } else { // Opening
        // Handle next
        i++; // Move to first char
        let name = ''; // Create a name
        while (xml.charCodeAt(i) !== 32 /* ' ' */ && xml.charCodeAt(i) !== 62 /* '>' */ && xml.charCodeAt(i) !== 47 /* '/' */) { // Go until attributes or closing. TODO: Handle XML attributes
          name += xml[i];
          i++;
        }
        let isSelfClosing = false;
        let attrs: [number, number, number, number][] = []
        while (xml.charCodeAt(i) !== 62 /* '>' */) { // Go until closing tag
          i++;
          if (xml.charCodeAt(i) !== 32 /* ' ' */ && xml.charCodeAt(i) !== 10 /* '\n' */ && xml.charCodeAt(i) !== 62 /* '>' */ && xml.charCodeAt(i) !== 47 /* '/' */) {
            const attrNameStart = i;
            let attrNameEnd = -1;
            i = xml.indexOf('=', i); // find =
            attrNameEnd = i;
            i += 2; // Skip ="
            let attrValueStart = i;
            while (xml.charCodeAt(i) !== 34 /* '"' */ || xml.charCodeAt(i - 1) === 92 /* '\' */) {
              i++;
            }
            attrs.push([attrNameStart, attrNameEnd, attrValueStart, i]);
          }
        }
        if (xml.charCodeAt(i - 1) === 47 /* '/' */) {
          isSelfClosing = true;
        }
        if (cur[name]) { // Already defined, create an array or add to existing array
          if (!(cur[name] instanceof Array)) {
            cur[name] = [cur[name]];
          }
          const next: any = {}
          cur[name].push(next);
          next.__parent = cur;
          if (!isSelfClosing) {
            cur = next;
            curName = name;
          }
          
        } else { // Not defined yet. Create new property on json object
          cur[name] = {};
          cur[name].__parent = cur;
          if (!isSelfClosing) {
            cur = cur[name];
            curName = name;
          }
        }
        if (attrs.length) {
          if (isSelfClosing) { // If it's self-closing with attributes, hop down into it
            if (cur[name] instanceof Array) {
              cur = cur[name][cur[name].length-1];
            } else {
              cur = cur[name];
            }
          }
          cur['$attrs'] = {}
          for (let i = 0; i < attrs.length; i++) {
            //            attr name start, attr name end,                  attr value start, attr value end
            cur['$attrs'][xml.slice(attrs[i][0], attrs[i][1])] = xml.slice(attrs[i][2], attrs[i][3]);
          }
          if (isSelfClosing) { // And hop back up
            cur = cur.__parent;
          }
        }
      }
      hasContent = false;
      curContentList = [];
    } else if (curName) { // Inside curName
      let contentFrom = i; // TODO: Handle mixed content
      while (xml.charCodeAt(i) !== 60 /* < */) {
        if (!hasContent && (xml.charCodeAt(i) !== 32 /* ' ' */ && xml.charCodeAt(i) !== 10 /* '\n' */)) {
          hasContent = true;
        }
        i++
      }
      let contentTo = i;
      i--
      curContentList.push([contentFrom, contentTo]) // TODO: Trim spaces
    }
  }
  return o;
}
