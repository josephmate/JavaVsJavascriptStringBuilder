function StringBuilder() {

    // cannot use String.fromCharCode due to
    // Uncaught RangeError: Maximum call stack size exceeded
    // so we are stuck with TextEncoder and TextDecoder
    // https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
    // https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder
    let utf8Decoder = new TextDecoder();
    let utf8Encoder = new TextEncoder();

    this.bufferConsumed = 0;
    this.capacity = 128;
    this.buffer = new Uint8Array(128);

    this.append = function (strToAdd) {
        // O(N) copy but ammortized to O(1) over all concats
        var encodedStr = utf8Encoder.encode(strToAdd);
        while (encodedStr.length + this.bufferConsumed > this.capacity) {
            var tmpBuffer = this.buffer;
            this.buffer = new Uint8Array(this.capacity*2);
            this.capacity = this.capacity*2;
            for(var i = 0; i < this.bufferConsumed; i++) {
                this.buffer[i] = tmpBuffer[i];
            }
        }

        // add the characters to the end
        for(var i = 0; i < encodedStr.length; i++) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
            this.buffer[i+this.bufferConsumed] = encodedStr[i];
        }
        this.bufferConsumed += encodedStr.length;

        return this;
    }

    this.build = function() {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode

        // cannot use ... array expansion
        // nor cannot use String.fromCharCode.apply
        // because at 2^17 I get
        // Uncaught RangeError: Maximum call stack size exceeded
        // at StringBuilder.build (experiment.js:31)
        // at runBuilderExperiment (experiment.js:43)
        // at runExperiment (experiment.js:79)
        // at runBrowserExperiment (index.html:32)
        // at HTMLButtonElement.onclick (index.html:43)
        // return String.fromCharCode(...this.buffer.slice(0, this.bufferConsumed));
        // return String.fromCharCode.apply(null, this.buffer.slice(0, this.bufferConsumed));
        
        var start = new Date().getTime();
        return utf8Decoder.decode(this.buffer.slice(0, this.bufferConsumed));
    }
}

const NODE_UTF16MAX = 1<<27-1;

class FastStringBuilder{
    u16 = new Uint16Array(512);
    length = 0;
    position = 0;
    decoder = new TextDecoder("utf-16le");
    reserve(end){
        if(end <= this.u16.length){
            if(end > this.length){
                this.length = end;
            }
            return;
        }
        let len = this.u16.length;
        while(len < this.length){
            len *= 2;
        }
        const u16n = new Uint16Array(len);
        u16n.set(this.u16);
        this.u16 = u16n;
        this.length = end;
    }
    append(str){
        this.reserve(this.position+str.length);
        let position = this.position;
        for(let i = 0; i < str.length; i++){
            this.u16[position++] = str.charCodeAt(i);
        }
        this.position = position;
    }
    toString(){
        const len = this.length;
        if(len < NODE_UTF16MAX){
            return this.decoder.decode(this.u16.subarray(0,this.length));
        }
        let res = "";
        let pos = 0;
        while(len - pos > NODE_UTF16MAX){
            res += this.decoder.decode(this.u16.subarray(pos,pos+NODE_UTF16MAX));
            pos += NODE_UTF16MAX;
        }
        res += this.decoder.decode(this.u16.subarray(pos,len));
        return res;
    }
}

const experiments = {
    builder(base, power, size) {
        var builder = new StringBuilder();
        var start = new Date().getTime();
        for (var i = 0; i < size; i++) {
            builder.append(""+(i%10));
        }
        var end = new Date().getTime();
        var duration = end - start;
        var result = builder.build();
        console.log("builder %d^%d %d %d %d", base, power, size, result.length, duration);
        return duration;
    },
    fastBuilder(base, power, size) {
        var builder = new FastStringBuilder();
        var start = new Date().getTime();
        for (var i = 0; i < size; i++) {
            builder.append(""+(i%10));
        }
        var end = new Date().getTime();
        var duration = end - start;
        var result = builder.toString();
        console.log("fast-builder %d^%d %d %d %d", base, power, size, result.length, duration);
        return duration;
    },
    concat(base, power, size) {
        var result = "";
        var start = new Date().getTime();
        for (var i = 0; i < size; i++) {
            result += (i%10);
        }
        var end = new Date().getTime();
        var duration = end - start;
        console.log("concat %d^%d %d %d %d", base, power, size, result.length, duration);
        return duration;
    },
    arrayJoin(base, power, size) {
        var builder = [];
        var start = new Date().getTime();
        for (var i = 0; i < size; i++) {
            builder.push(i%10);
        }
        var result = builder.join("");
        var end = new Date().getTime();
        var duration = end - start;
        console.log("join %d^%d %d %d %d", base, power, size, result.length, duration);
        return duration;
    },
    rustBuilder(base, power, size) {
        // The arguments have to be consistent with the others for this to work
        // Using a global variable is the next best thing
        var builder = _rustStringBuilderFunction();
        var start = new Date().getTime();
        for (var i = 0; i < size; i++) {
            builder.append(""+(i%10));
        }
        var end = new Date().getTime();
        var duration = end - start;
        var result = builder.build();
        console.log("rust builder %d^%d %d %d %d", base, power, size, result.length, duration);
        return duration;
    }
};

let _rustStringBuilderFunction;

function runExperiment(options, rustStringBuilderFunction){
    _rustStringBuilderFunction = rustStringBuilderFunction;
    const defaultOptions = {
        powerLimit:27,
        base:2,
        timeout:2000 // cut off longer than 2000 ms
    };
    for(let key in defaultOptions){
        if(!(key in options))options[key] = defaultOptions[key];
    }

    const results = [];
    const timedOuts = new Set;
    if(rustStringBuilderFunction === undefined)
        timedOuts.add("rustBuilder");
    for(let power = 1; power <= options.powerLimit; power++){
        const size = Math.pow(options.base, power);
        const result = {};
        for(let expName in experiments){
            if(timedOuts.has(expName))continue;
            const limitName = expName+"Limit";
            if(limitName in options){
                if(power > options.limitName){
                    timedOuts.add(expName);
                    continue;
                }
            }
            const duration = experiments[expName](options.base, power, size);
            if(duration > options.timeout)timedOuts.add(expName);
            result[expName+"Duration"] = duration;
        }
        results.push(result);
    }
    return results;
}

module.exports = {
    run: function (base, powerLimit) {
        runExperiment({base, powerLimit});
    }
};
  
