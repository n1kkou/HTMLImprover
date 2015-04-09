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
        console.log(meta[i].toUpperCase() + ' meta is not declared.');
      }else{ 
				if( !_head.querySelector('[name="' + meta[i] + '"]').getAttribute('content') ){
					console.log(meta[i].toUpperCase() + ' exists but has no text content.');
				}
			}
    }
  }());
  
  
  
//************************************ BODY
//************************************ check images
  (function scanImages(){
    var _images = document.getElementsByTagName('img'),
        i,
        elems = _images.length;
    
    for(i=0; i<elems; i++){
      // check if images have ALT text
      if( !_images[i].getAttribute('alt') ){
        console.log('The image with the following SRC attribute ' + _images[i].getAttribute('src') + ' should have an ALT description.');
      }
      
      // check if images have inline WIDTH attribute
      if( !_images[i].getAttribute('width') ){
        console.log('The image with the following SRC attribute ' + _images[i].getAttribute('src') + ' should have a WIDTH attribute.');
      }
      
      // check if images have inline HEIGHT attribute
      if( !_images[i].getAttribute('height') ){
        console.log('The image with the following SRC attribute ' + _images[i].getAttribute('src') + ' should have a HEIGHT attribute.');
      }
    }
    
  })();
  
  
//************************************ check anchors
  (function scanAnchors(){
    var _anchors = document.getElementsByTagName('a'),
        i,
        elems = _anchors.length,
        hyp = [],
				missingHref = 0,
				nullHref = 0,
				label = '',
				label1 = '';
    
    for(i=0; i<elems; i++){
      var loc = _anchors[i].getAttribute('href') || 'nohref';
      if( !_anchors[i].getAttribute('title') ){
        console.log('The anchor with the following href location ' + _anchors[i] + ' should have a TITLE attribute.');
      }

      if( loc.indexOf('-') !== -1 && loc.replace(/[^-]/g, '').length > 3){
        console.log(_anchors[i] + ' contains more than 3 hypens(' + loc.replace(/[^-]/g, '').length + ') and might look spammy.' );
      }
			
			if( !_anchors[i].getAttribute('href') ){
				if( _anchors[i].getAttribute('href') === null ){ nullHref++; }
				missingHref++;
			}
    }
		
		nullHref > 1 ? label1='anchors' : label1='anchor';
		missingHref > 1 ? label='anchors' : label='anchor';
		
		missingHref ? console.log('You have ' + missingHref + ' ' + label + ' with a missing href declaration.') : '';
		nullHref ? console.log('You have ' + nullHref + ' ' + label1 + ' with an empty href.') : '';
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
  
  
	
	
})();