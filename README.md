# HTMLImprover  

Markup Improver<br>
This tool tries to improve HTML markup and usage. Also gives you some statistics about external stylesheets and scripts references.


### Features:  

- Logs total number of external Stylesheets
- Logs total number of external Javascript files
- Warns about inline styles
- Warns about missing document language
- Warns about missing document charset meta
- Warns about missing or referencing wrong HTML elements from 'href' attributes of anchors
- Warns about Javascript code in document HEAD sections
- Warns about deprecated tags and attributes in HTML5 document type


### Usage:
Install from npm
```js
npm i htmlimprover
```
Include the module and initialize it wherever you want to get hints about the HTML markup.
```js
import * as HTMLImprover from 'htmlimprover';

HTMLImprover.ScanHTML();
```
### Vanilla version
For apps that aren't using Node modules, there is also a vanilla version.
Include the script at the end of your document and call the *ScanHTML* function:
