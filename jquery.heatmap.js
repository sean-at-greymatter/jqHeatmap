/*
 * 
 * Heatmap 1.0 - JQuery table heatmap
 * Version 1.0
 * @requires jQuery v1.8
 * 
 * Copyright (c) 2012 Sean Wilson & Grey Matter Ltd.
 */
/**
 * 
 * @description Apply 3-colour heatmap colouring to each individual row of a table of values
 * 
 * @example $('table').heatmap();
 * @desc Simply apply the default heatmap to all columns of a table.
 * 
 * @example $('table').heatmap({colExclude: [0,9]});
 * @desc Apply a heatmap using all columns except column 0 and 9.
 * 
 * @param Object
 *            settings An object literal containing key/value pairs to provide
 *            optional settings.
 * 
 * @option Array colExclude (optional) An array of column indexes to ignore.  
 *         Dafult value: null. 
 *                                         
 * @option Array colourMin (optional) An array of 3 numbers defining the rgb
 *         colour for the minimum value.
 *         Default value: [240, 128, 128]
 * 
 * @option Array colourMid (optional) An array of 3 numbers defining the rgb
 *         colour for the median value.
 *         Default value: [240, 224, 127]
 * 
 * @option Array colourMax (optional) An array of 3 numbers defining the rgb
 *         colour for the maximum value.
 *         Default value: [64, 192, 127]
 * 
 * @option Pattern ignoreChars (optional) A pattern defining a set of characters
 *         to strip from the cell value before determining the value.
 *         Default value: /[\,$£]/ 
 * 
 * @author Sean Wilson
 */

(function( $ ){

  $.fn.heatmap = function(options) {  
    // Create defaults, extending them with any options that were provided
    var settings = $.extend({
      'colExclude'      : null,             // Columns to exclude from heatmap
      'colourMin'       : [240, 128, 128],  // Colour for lowest value
      'colourMid'       : [240, 224, 127],  // Midpoint colour
      'colourMax'       : [64, 192, 127],   // Colour for highest value    
      'ignoreChars'     : /[\,$£]/   
    }, options);

    // Apply the heatmap
    return this.each(function() {        
      var 
        cx = settings.colExclude,        
        cl = settings.colourMin,
        cm = settings.colourMid,
        ch = settings.colourMax,
        r = 0, g = 0, b = 0,
        pct = 0,              
        val = 0,
        min = 0,   
        max = 0;

      var $this = $(this);
    
      // Loop through each row calculating it's colour based on it's % in the range
      $('tbody tr', $this).each(function(){
        max = 0;
        min = 0;
        
        // Work out range of values
        $(this).find('td').each(function() {
          if (cx == null || $.inArray(this.cellIndex, cx) == -1) {
            val = $(this).text().replace(settings.ignoreChars,"");            
            val = parseFloat(val);
        
            if (val > max) {
              max = val;
            }
            else if (val < min) {
              min = val;
            }
          }
        });                                                     
      
        // Apply heatmap colouring depending on value position in range
        $(this).find('td').each(function() {
          if (cx == null || $.inArray(this.cellIndex, cx) == -1) {
            val = $(this).text().replace(settings.ignoreChars,"");            
            val = parseFloat(val);
            pct = parseInt((Math.round(100*(val-min)/(max-min))).toFixed(0));

            if (pct <= 50) {
              pct = pct / 50;                             
              r = parseInt((cl[0] + pct*(cm[0]-cl[0])).toFixed(0));
              g = parseInt((cl[1] + pct*(cm[1]-cl[1])).toFixed(0));
              b = parseInt((cl[2] + pct*(cm[2]-cl[2])).toFixed(0));
            }
            else {
              pct = (pct / 50) - 1;
              r = parseInt((cm[0] + pct*(ch[0]-cm[0])).toFixed(0));
              g = parseInt((cm[1] + pct*(ch[1]-cm[1])).toFixed(0));
              b = parseInt((cm[2] + pct*(ch[2]-cm[2])).toFixed(0));
            }        

            clr = 'rgb('+r+','+g+','+b+')';
            $(this).css({backgroundColor:clr});
          }
        });
      });
    });
  };
})( jQuery );
