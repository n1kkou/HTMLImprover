// check charset definition
// DOM analyzer v1.1
// functional programming related


// Console.group helper
function group(groupName, logType, message){
    
    console.groupCollapsed(groupName);
    console[logType](message);
    console.groupEnd();
}

// Scan script files and return the number of script element found
function getScriptFiles(_src){

    var headHasScripts = false,
        warnUser;
    
    if(document.head.getElementsByTagName('script').length){
        headHasScripts = true;
    }
    
    warnUser = headHasScripts ? 'Consider moving script files from document\'s head (' + document.head.getElementsByTagName('script').length + ' script files) to the end of the document.' : '';
        
    return 'Your document contains ' + _src.getElementsByTagName('script').length + ' script files. ' + warnUser;
}

// Scan DOM nodes and return the entire array collection
function getDOMnodes(_src){

    return _src.childNodes;
}

// Read document rows length
function getDOMlines(_src) {
        
    var rows = 4,
        target = _src.split('\n');

    for( var _key in target ){
        rows+=1;
    }
    
    return 'Experimental mode. The document has ' + rows + ' rows.';
};

// Check if a charset meta tag was defined
function getCharset(){
    var metas = document.head.getElementsByTagName('meta'),
        charsetDetected = false,
        charsetValue;
    
    for(var i = 0; i<metas.length; i++){
        if(metas[i].getAttribute('charset') && metas[i].getAttribute('charset').length > 1){
            charsetDetected = true;
            charsetValue = metas[i].getAttribute('charset');
        }
    }    
    
    return charsetDetected ? 'Your document has a charset value set to: ' + charsetValue : 'No charset meta has been set!';
}

// Check document language
function getLanguage(){
    
    return document.documentElement.getAttribute('lang') ? '' : 'You should specify a lang attribute for your document content. e.g. <html lang="en-US">'; 
}

// Microdata[schema.org]
function scanMicroData(){
    
    var 
        schema = document.querySelector('[itemscope]'),
        schemaType,
        schemaMessage;
    
    if( schema ){
        
        if ( schema.getAttribute('itemtype') ){

            schemaType = true;
            schemaMessage = 'Congrats! You have at least one microdata schema.';

        }else{

            schemaType = false;
            schemaMessage = 'You microdata schema is not valid. You need to specify an \"itemtype\" for your schema.';
        }
    }else{
        
        schemaMessage = 'You might use a microdata schema for your website to describe the website content. Choose one from www.schema.org';
      
    }
    
    return schemaMessage;
};


// init all helpers
window.onload = (function() {
    
	console.time("Script execution time");
  
    var
        _head = document.head,
        _body = document.body,
        _rootArguments = arguments;
    
    // Display meta Charset info
    group('Document Charset', 'info', getCharset());

	// Display General info about the document
    group('Document lines', 'info', getDOMlines(document.documentElement.outerHTML));
  
    // Check if the current document has a lang defined
    group('Document Language', 'info', getLanguage());

	// Script files
    group('Document Script files', 'info', getScriptFiles(document));
    
    // Schema microformat
    group('Microdata - Schema.org', 'info', scanMicroData());

    
    
    // to refactor
//************************************ HEAD	
//********************************** check for head and body elements, throw a warning if they are unset
  if( !_head ){ 
    console.log('No HEAD element detected'); 
  }

  if( !_body ){ 
    console.log('No BODY element detected'); 
  }

  if( !_head.querySelector('title') ){ 
      
    console.log('No TITLE attribute detected'); 
  }else if( _head.querySelector('title').innerText.length < 3 ){
      
    console.log('TITLE attribute could be longer'); 
  }
  
	console.groupEnd();
	
//********************************** head element - parsing and checking 
	console.groupCollapsed("HTML Meta tags");
  (function scanMeta(){
    var i, j,
        meta = ['description', 'keywords'], // set what meta names to be checked
        args = meta.length,
        metaSource = _head.querySelectorAll('meta'),
        metaSourceValues = [];
    
    for(i=0; i<metaSource.length; i++ ){
      metaSourceValues.push(metaSource[i].getAttribute('name'));
    }
    
    
    for(i=0; i<args; i++){
      if( metaSourceValues.indexOf(meta[i]) === -1 ){          
        console.log('meta tag ' + meta[i].toUpperCase() + ' is not declared.');
      }else{ 
				if( !_head.querySelector('[name="' + meta[i] + '"]').getAttribute('content') ){
					console.log('meta tag ' + meta[i].toUpperCase() + ' exists but has no content.');
				}
			}
    }
  }());
	console.groupEnd();
  
  
  
//************************************ BODY
//************************************ check images
	console.groupCollapsed("Images");
  (function scanImages(){
    var _images = document.getElementsByTagName('img'),
        badSeoImages = i = j = k = l = m = n = 0,
				_keys,
        elems = _images.length,
				imageProps = {};
		
    for(i; i<elems; i++){
      // check if images have ALT text
      if( !_images[i].getAttribute('alt') ){
				j++;
      }
      
			/*
      // check if images have inline WIDTH attribute
      if( !_images[i].getAttribute('width') ){
				k++;
      }
      
      // check if images have inline HEIGHT attribute
      if( !_images[i].getAttribute('height') ){
				l++;
      }
			*/
			
    }
		
		k ? console.log('Detected ' + k + ' images which need an WIDTH value.'): '';
		l ? console.log('Detected ' + l + ' images which need an HEIGHT value.'): '';
		j ? console.log('Detected ' + j + ' images which need an ALT description.') : '';
    
		
		// src - alt compare
		for(m; m<elems; m++){
			var _this = _images[m];
			
			if( _this.getAttribute('src') && _this.getAttribute('alt') ){
				imageProps[m] = { 
					'src' : _this.getAttribute('src').split('/'),
					'alt' : _this.getAttribute('alt').split(' ')
				};
			}
		}
		
		// if( imageProps )
		for(var _keys in imageProps){
			var ln = imageProps[_keys]['alt'],
					compare = imageProps[_keys]['src'],
					_temp = 0;
			for(n; n<ln.length; n++ ){
				if( compare.indexOf(ln[n]) == -1 ){
					_temp++;
				}
			}
			if( _temp == ln.length ){ badSeoImages++; }
		}
		
		badSeoImages > 0 ? console.log("Detected " + badSeoImages + " images width SRC description not matching the image file name description.") : '';
		
		console.log('All images that have both \'src\' and \'alt\' tags defined: ');
		console.dir(imageProps);
  })();
	console.groupEnd();
  
  
//************************************ check anchors
	console.groupCollapsed("Hyperlinks");
  (function scanAnchors(){
    var _anchors = document.getElementsByTagName('a'),
        i,
				j = 0,
				k = 0,
				k1 = [],
        elems = _anchors.length,
        hyp = [],
				missingHref = 0,
				nullHref = 0,
				label = '',
				label1 = '';
				
		if( !_anchors.length ){ console.log("No anchors detected") }; 
    
    for(i=0; i<elems; i++){
      var loc = _anchors[i].getAttribute('href') || 'nohref';
			
			if( (loc.length > 1) && (loc[0] == '#') ){
				if( !document.querySelector(loc) ){
					k++;
					k1.push(loc);
				}
			}
			
      if( !_anchors[i].getAttribute('title') ){
				j++;
      }

      if( loc.indexOf('-') !== -1 && loc.replace(/[^-]/g, '').length > 3){
        console.log('Detected anchor with the following HREF attribute: ' + _anchors[i] + ' has more than 3 hypens(' + loc.replace(/[^-]/g, '').length + ') and might look spammy.' );
      }
			
			if( !_anchors[i].getAttribute('href') ){
				if( _anchors[i].getAttribute('href') === null ){ nullHref++; }
				missingHref++;
			}
    }
		
		nullHref > 1 ? label1='anchors' : label1='anchor';
		missingHref > 1 ? label='anchors' : label='anchor';
		
		missingHref ? console.log('Detected ' + missingHref + ' ' + label + ' with a missing href declaration.') : '';
		nullHref ? console.log('Detected ' + nullHref + ' ' + label1 + ' with an empty href.') : '';
		
		j ? console.log('Detected ' + j + ' anchors which need a TITLE attribute.') : '';
		k ? console.log('Detected ' + k + ' anchors which target elements in the same page but don\'t have targeted elements. The following targeted elements were not found: ' + k1) : '';
  })();
  	console.groupEnd();
 
	
// end of to refactor code
    

	console.timeEnd("Script execution time");
})();