function HTMLImprover(){
	"use strict";
	
	/**
	 * DOM analyzer
	 * <p>JavaScript scanner to improve document SEO and structure.</p>
	 * v1.2
	 *
	 * Author: Lucian Andrei
	 * Author URL: http://github.com/n1kkou
	 * Author URL2: http://andreilazar.com
	 */
	
	/**
	 * DOM elements caching
	 */
	var _doc = document,
		_head = _doc.head,
		_body = _doc.body;
	
	/**
	 * Helper functions
	 */
	function tagTotal (type, src) {
		"use strict";
		
		var _src = src || _doc;
		return _src.getElementsByTagName(type).length;
	}
	
	function getAllSelectorsLength (type, src) {
		"use strict";
		
		var _src = src || _doc;
		return _src.querySelectorAll(type).length;
	}
	
	function getAllBySelector (type, src) {
		"use strict";
		
		var _src = src || _doc;
		return _src.querySelectorAll(type);
	}
	
	function getAllByTag (name, container) {
		"use strict";
		
		var _container = container || _doc;
		
		return _container.getElementsByTagName(name);
	}
	
	/**
	 * Get elements by class name and return the collection.
	 *
	 * @param className
	 * @param container
	 * @returns {NodeList}
	 */
	function getClass (className, container) {
		"use strict";
		
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
	 * Warn if a <b>charset</b> meta tag was not defined
	 */
	function getCharset () {
		var metas = tagTotal('meta', _head),
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
		"use strict";
		
		var docScripts = tagTotal('script');
		
		if (docScripts) {
			
			console.info('Your document has a total of ' + docScripts + ' external script references.');
		}
	}
	
	/**
	 * Logs the total number of external stylesheets files
	 */
	function getTotalStylesheets () {
		"use strict";
		
		var docStylesheets = getAllSelectorsLength('[rel=stylesheet]');
		
		if (docStylesheets) {
			
			console.info('Your document has a total of ' + docStylesheets + ' external stylesheets references.');
		}
	}
	
	function getInlineStyles () {
		"use strict";
		
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
	
	console.log("asd");
	
	return {
		'totalScripts': getTotalScripts,
		'totalStylesheets': getTotalStylesheets,
		'documentLanguage': getLanguage,
		'documentCharset': getCharset,
		'scriptsInHead': scriptTagsInHead,
		'stylesInline': getInlineStyles
	};
}

exports.HTMLImprover = HTMLImprover;