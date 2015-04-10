// rows length and troubleshooting by rows
// check charset definition

window.onload = (function genie() {
  
  var _head = document.querySelector('head'),
      _body = document.querySelector('body'),
      _rootArguments = arguments;
	
	
// detect rows[exprimental stage]
	(function countDocumentLength(context, element) {
		var rows = 4, target = context.split('\n');
		for( var _key in target ){
			rows+=1;
		}
		console.log('The document has ' + rows + ' rows.[experimental mode. If your document doesnt have an explicit doctype rule, you will get a +1 value for rows.]');
	})(document.documentElement.outerHTML, document.querySelector('a'));
  

// check if the current document has a lang defined
	if( !document.documentElement.getAttribute('lang') ){ console.log('You should specify a lang attribute for your document content. e.g. <html lang="en">'); }
	
	
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
  
	
	
//********************************** head element - parsing and checking 
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
        console.log('meta tag ' + meta[i].toUpperCase() + ' meta is not declared.');
      }else{ 
				if( !_head.querySelector('[name="' + meta[i] + '"]').getAttribute('content') ){
					console.log('meta tag ' + meta[i].toUpperCase() + ' exists but has no content.');
				}
			}
    }
  }());
  
  
  
//************************************ BODY
//************************************ check images
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
      
      // check if images have inline WIDTH attribute
      if( !_images[i].getAttribute('width') ){
				k++;
      }
      
      // check if images have inline HEIGHT attribute
      if( !_images[i].getAttribute('height') ){
				l++;
      }
			
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
		
		console.log(imageProps);
		
		badSeoImages > 0 ? console.log("Detected " + badSeoImages + " images width SRC description not matching the image file name description.") : '';
		
		
  })();
  
  
//************************************ check anchors
  (function scanAnchors(){
    var _anchors = document.getElementsByTagName('a'),
        i,
				j = 0,
        elems = _anchors.length,
        hyp = [],
				missingHref = 0,
				nullHref = 0,
				label = '',
				label1 = '';
    
    for(i=0; i<elems; i++){
      var loc = _anchors[i].getAttribute('href') || 'nohref';
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
  })();
  
 
	
//************************************ detect schema.org usage
  (function scanMicroData(){
    var schema = document.querySelector('[itemscope]');
    if( schema ){
      if ( schema.getAttribute('itemtype') ){
      	console.log('Congrats! You have at least one microdata schema.');
      }else{
				console.log('You microdata schema is not valid. You need to specify an \"itemtype\" for your schema.');
			}
    }else{
      console.log('You might use a microdata schema for your website. Choose one from www.schema.org');
    }
  })();
  
	
	
	
	
// universal element check[in progress]
	/*
	function SS(type, elem, props){
		var i = 0,
				j = 0,
				_scope,
				_scopeLength = 0,
				
				messages = { 'undefined' : ' is undefined',
									 
									 };
		
		if( type === "id" ){
			_scope = document.getElementById(elem);
			_scopeLength = 1;
		}else if( type === "class" ){
			_scope = document.getElementsByClassName(elem);
		}else if( type === "tag" ){
			_scope = document.getElementsByTagName(elem);
		}
		
		if( _scopeLength !== 1 ){ _scopeLength = _scope.length; }
		
		if( _scopeLength && _scopeLength > 1){
			for(i; i<_scopeLength; i++){
				// console.log(_scope[i]);
				
				for(j;j<props.length;j++){
					//console.log(props[j]);
					if( !_scope[i].getAttribute(props[j]) ){ 
						console.log( props[j] + messages.undefined );
					}
					
				}
				
			}
		}
		
	};

	
	*/
	
	
	
})();