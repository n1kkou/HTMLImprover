function ScanHTML () {
    "use strict";

    /**
     * DOM elements caching
     */
    var _doc = document,
        _head = _doc.head,
        _body = _doc.body;

    var elems = getAllBySelector('*', _doc);
    // cached all elements for later queries when verifying deprecated tags/attributes.

    /**
     * Helper functions
     */

    /**
     * Returns a counter of total elements found by TAG name
     *
     * @param {String} type
     * @param src
     * @returns {number}
     */
    function tagTotal (type, src) {
        var _src = src || _doc;
        return _src.getElementsByTagName(type).length;
    }

    /**
     * Returns a counter of total elements found by custom attribute/tag/class name
     *
     * @param {String} type
     * @param src
     * @returns {number}
     */
    function getAllSelectorsLength (type, src) {
        var _src = src || _doc;
        return _src.querySelectorAll(type).length;
    }

    /**
     * Returns a collection of all elements found by custom attribute/tag/class name
     *
     * @param {String} type
     * @param src
     * @returns {NodeList}
     */
    function getAllBySelector (type, src) {
        var _src = src || _doc;
        return _src.querySelectorAll(type);
    }

    /**
     * Returns a collection of all elements found by tag name
     *
     * @param {String} name
     * @param container
     * @returns {NodeList}
     */
    function getAllByTag (name, container) {
        var _container = container || _doc;
        return _container.getElementsByTagName(name);
    }

    /**
     * Returns a JSON stringify collection of all element' attributes.
     *
     * @param {Element} elementSelector
     */
    function getAttributes (elementSelector) {
        var attrs = elementSelector.attributes,
            attrsLength = attrs.length,
            j,
            result = [];

        for (j = 0; j < attrsLength; j++) {
            var attrObject = attrs[j],
                newObj = {};

            newObj[attrObject.name] = attrObject.value;

            result.push(newObj);
        }

        return JSON.stringify(result);
    }

    /**
     * Get elements by class name and return the collection.
     *
     * @param className
     * @param container
     * @returns {NodeList}
     */
    function getClass (className, container) {
        var _container = container || _doc;
        return _container.getElementsByClassName(className);
    }

    /**
     * Warn about scripts placed in the HEAD section of the document
     */
    function scriptTagsInHead () {
        var total = tagTotal('script', _head);

        if (total) {
            console.warn("HEAD Scripts Warning: Consider moving script files from document's head to the end of the document.");
            console.warn("HEAD Scripts Warning: Total script files found in HEAD element: ", total);
        }
    }

    /**
     * Warns if a <b>charset</b> meta tag was not defined
     */
    function getCharset () {
        var metas = document.head.getElementsByTagName('meta'),
            charsetDetected = false;

        for (var i = 0; i < metas.length; i++) {
            var _i = metas[i];

            if (_i.getAttribute('charset') && _i.getAttribute('charset').length > 1) {
                charsetDetected = true;
            }
        }

        if (!charsetDetected) {

            console.warn('META - Charset: No charset meta has been set!');
        }
    }

    /**
     * Warn if a language attribute is not defined for the entire document
     */
    function getLanguage () {
        if (!document.documentElement.getAttribute('lang')) {
            console.warn('META - Lang: You should specify a LANG attribute for your document content.');
        }
    }

    /**
     * Logs the total number of external script files
     */
    function getTotalScripts () {
        var docScripts = tagTotal('script');

        if (docScripts) {
            console.info('Your document has a total of ' + docScripts + ' external script references.');
        }
    }

    /**
     * Logs the total number of external stylesheets files
     */
    function getTotalStylesheets () {
        var docStylesheets = getAllSelectorsLength('[rel=stylesheet]');

        if (docStylesheets) {

            console.info('Your document has a total of ' + docStylesheets + ' external stylesheets references.');
        }
    }

    /**
     * Warns about inline styles used in HEAD and BODY sections.
     */
    function getInlineStyles () {
        var inlineInHead = tagTotal('style', _head),
            _inlineInBody = tagTotal('style', _body),
            bodyElements = getAllBySelector('*', _body),
            i,
            bodyElementsLength = bodyElements.length,
            inlineInBody = _inlineInBody || 0;

        for (i = 0; i < bodyElementsLength; i++) {
            var _item = bodyElements[i];

            if (_item.getAttribute('style')) {
                ++inlineInBody;
            }
        }

        if (inlineInHead > 1) {
            console.warn('You have ' + inlineInHead + ' inline styles in the document HEAD section. Consider moving them into an external stylesheet.');
        }

        if (inlineInBody) {
            console.warn('You have ' + inlineInBody + ' inline styles in the document BODY section. Consider moving them into an external stylesheet.');
        }
    }

    /**
     * Warns about anchors with a missing/wrong HREF attribute or missing referenced fragments.
     */
    function checkAnchors () {
        var anchors = getAllByTag('a'),
            anchorsLength = anchors.length,
            i;

        for (i = 0; i < anchorsLength; i++) {

            var anchorHref = anchors[i].getAttribute('href');

            if (!anchorHref || anchorHref.length < 1) {
                console.warn('Elements A: The following link is missing or has an invalid href value: ', anchors[i]);
            }

            if ((anchorHref.length > 1) && (anchorHref.substr(0, 1) === '#')) {
                var referencedElement = document.getElementById(anchorHref.substr(1));

                if (!referencedElement) {
                    console.warn('Elements A: The following link is referencing a missing HTML element. Missing HTML element: ', anchorHref, anchors[i]);
                }
            }

        }
    }

    /**
     * Find deprecated tags (if document type is HTML5)
     *
     */
    function findDeprecatedTags () {
        var _deprecatedTags = ['acronym', 'applet', 'basefont', 'big', 'center', 'dir', 'font', 'frame', 'frameset', 'isindex', 'noframes', 's', 'strike', 'tt'],
            i,
            elemsLen = elems.length;

        for (i = 0; i < elemsLen; i++) {
            var _deprecatedElement = elems[i].nodeName.toLowerCase();
            if (_deprecatedTags.indexOf(_deprecatedElement) !== -1) {
                console.warn('Deprecated HTML tag found: <' + _deprecatedElement + '/>');
            }
        }
    }

    /**
     * Find deprecated attributes (if document type is HTML5)
     *
     */
    function findDeprecatedAttributes () {
        var _deprecatedAttributes = [
                {
                    'rev': ['link', 'a']
                },
                {
                    'charset': ['link', 'a']
                },
                {
                    'shape': ['a']
                },
                {
                    'coords': ['a']
                },
                {
                    'longdesc': ['img', 'iframe']
                },
                {
                    'target': ['link']
                },
                {
                    'nohref': ['area']
                },
                {
                    'profile': ['head']
                },
                {
                    'version': ['html']
                },
                {
                    'name': ['img']
                },
                {
                    'scheme': ['meta']
                },
                {
                    'archive': ['object']
                },
                {
                    'classid': ['object']
                },
                {
                    'codebase': ['object']
                },
                {
                    'codetype': ['object']
                },
                {
                    'declare': ['object']
                },
                {
                    'standby': ['object']
                },
                {
                    'valuetype': ['param']
                },
                {
                    'axis': ['td']
                },
                {
                    'abbr': ['td']
                },
                {
                    'scope': ['td']
                },
                {
                    'align': ['caption', 'iframe', 'img', 'input', 'object', 'legend', 'table', 'hr', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']
                },
                {
                    'alink': ['body']
                },
                {
                    'link': ['body']
                },
                {
                    'vlink': ['body']
                },
                {
                    'text': ['body']
                },
                {
                    'background': ['body']
                },
                {
                    'bgcolor': ['table', 'tr', 'td', 'th', 'body']
                },
                {
                    'border': ['table', 'object']
                },
                {
                    'cellpadding': ['table']
                },
                {
                    'cellspacing': ['table']
                },
                {
                    'char': ['col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']
                },
                {
                    'charoff': ['col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']
                },
                {
                    'clear': ['br']
                },
                {
                    'compact': ['dl', 'menu', 'ol', 'ul']
                },
                {
                    'frame': ['table']
                },
                {
                    'frameborder': ['iframe']
                },
                {
                    'hspace': ['img', 'object']
                },
                {
                    'vspace': ['img', 'object']
                },
                {
                    'marginheight': ['iframe']
                },
                {
                    'marginwidth': ['iframe']
                },
                {
                    'noshade': ['hr']
                },
                {
                    'nowrap': ['td', 'th']
                },
                {
                    'rules': ['table']
                },
                {
                    'scrolling': ['iframe']
                },
                {
                    'size': ['hr']
                },
                {
                    'type': ['li', 'ol', 'ul', 'param']
                },
                {
                    'valign': ['col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr']
                },
                {
                    'width': ['hr', 'table', 'td', 'th', 'col', 'colgroup', 'pre']
                }
            ],
            i,
            j,
            k,
            elemsLen = elems.length;

        for (i = 0; i < elemsLen; i++) {
            var _element = elems[i].nodeName.toLowerCase().toString();
            var _attributes = JSON.parse(getAttributes(elems[i]));
            var _attributesLength = _attributes.length;
            var _deprecatedKeysLength = _deprecatedAttributes.length;

            for (j = 0; j < _attributesLength; j++) {
                var attrKey = Object.keys(_attributes[j])[0].toString();

                for (k = 0; k < _deprecatedKeysLength; k++) {
                    var _temp = Object.keys(_deprecatedAttributes[k])[0].toString();

                    if ((attrKey === _temp) && (_deprecatedAttributes[k][_temp].indexOf(_element) !== -1)) {
                        console.warn('Deprecated HTML attribute [' + attrKey + '] found on the: <' + _element + '/> element');
                    }
                }
            }
        }
    }

    /**
     * Info
     */
    getTotalScripts();
    getTotalStylesheets();

    /**
     * Warnings
     */
    getLanguage();
    getCharset();
    scriptTagsInHead();
    getInlineStyles();
    checkAnchors();

    /**
     * If the document ype is html5, run the deprecation checks
     * Important note: the doctype check is working in browsers starting from IE9+
     */
    if (new XMLSerializer().serializeToString(document.doctype).toLowerCase() === '<!doctype html>') {
        findDeprecatedTags();
        findDeprecatedAttributes();
    }
}
