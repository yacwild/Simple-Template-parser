    
module Utils{
    
    
    /**
     * Inspect all items of Array or Object
     * @param obj
     * @param callback
     */
    export function forEach( obj:any, callback:( element:any, index:any )=>any ){
        if( isFunction( callback ) && obj ) {
            if ( isArraylike( obj ) && !isEmptyArray( obj ) ) {
                for (var i = 0; i < obj.length && callback.call( obj[i], obj[i], i ) !== false; i++) {
                }
            } else if( isObject( obj ) && !isEmptyObject(obj)) {
                for ( var attribute in obj ) {
                    if ( obj.hasOwnProperty(attribute) && callback.call( obj[attribute], obj[attribute], attribute ) === false) {
                        break;
                    }
                }
            }
        }
    }


    /**
     *
     * @param dest
     * @param src
     * @param notOverwrite
     * @returns {Object}
     */
    export function cloneObject(dest:any, src:any, notOverwrite:boolean=false):any {
        for(var prop in src) {
            if(src.hasOwnProperty(prop)) {
                var value = src[prop];
                if(!notOverwrite || !(prop in dest)) {
                    dest[prop] = value;
                }
            }
        }
        return dest;
    }

    /**
     * 
     */
    export function isEmptyObject( obj:any ) {
        for(var i in obj) {
            if( obj.hasOwnProperty( i )  ) {
                return false;
            }
        }
        return true;
    }

    /**
     * 
     */
    export function isEmptyArray( obj:any ) {
        return !(obj && obj.length);
    }

    /**
     * 
     */
    export function isFunction(value:any):boolean{ return value instanceof  Function || typeof value === 'function'; }

    /**
     * Check if the vlaue is a Array
     * @param value
     * @returns {boolean}
     */
    export function isArray(value:any[]):boolean{ return value instanceof  Array; }

    /**
     * 
     */
    export function isArraylike( value:any ):boolean{
        var length = 'length' in value && value.length;

        if ( isFunction(value) ) {
            return false;
        }

        if ( value.nodeType === 1 && length ) {
            return true;
        }

        return isArray(value) || length === 0 ||
            typeof length === 'number' && length > 0 && ( length - 1 ) in value;
    }

    /**
     * Check if the vlaue is a Object
     * @param value
     * @returns {boolean}
     */
    export function isObject(value:any):boolean{ return value instanceof  Object && !(value instanceof Array); }

    /**
     * Check if the vlaue is a Null
     * @param value
     * @returns {boolean}
     */
    export function isNull(value:any):boolean{ return value === null; }

    /**
     * Check if the vlaue is a string
     * @param value
     * @returns {boolean}
     */
    export function isString(value:any):boolean{ return typeof value === 'string'; }

    /**
     * Check if the vlaue is a Numeric
     * @param value
     * @returns {boolean}
     */
    export function isNumeric(value:any):boolean{ return !isNaN(parseFloat(value)) && isFinite(value); }

    /**
     * 
     */
    export function trim(str){
        if(isFunction(trim))
            return  str.trim();
        else
            return str.replace(/\S/.test('\xA0') ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g, '');
    }

}
