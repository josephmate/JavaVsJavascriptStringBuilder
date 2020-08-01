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

function runBuilderExperiment(base, power, size) {
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
}

function runConcatExperiment(base, power, size) {
    var result = "";
    var start = new Date().getTime();
    for (var i = 0; i < size; i++) {
        result += (i%10);
    }
    var end = new Date().getTime();
    var duration = end - start;
    console.log("concat %d^%d %d %d %d", base, power, size, result.length, duration);
    return duration;
}

function runArrayJoinExperiment(base, power, size) {
    var builder = [];
    var start = new Date().getTime();
    for (var i = 0; i < size; i++) {
        builder.push(i%10);
    }
    var result = builder.join();
    var end = new Date().getTime();
    var duration = end - start;
    console.log("join %d^%d %d %d %d", base, power, size, result.length, duration);
    return duration;
}

function runExperiment(base, powerLimit) {
    var results = [];
    for(var power = 1; power <= powerLimit; power++) {
        var size = Math.pow(base, power);
        var concatDuration = runConcatExperiment(base, power, size);
        var arrayJoinDuration = runArrayJoinExperiment(base, power, size);
        var builderDuration = runBuilderExperiment(base, power, size);
        results.push({
            base: base,
            power: power, 
            size: size,
            concatDuration: concatDuration,
            arrayJoinDuration: arrayJoinDuration,
            builderDuration: builderDuration
        });
    }
    return results;
}

module.exports = {
    run: function (base, powerLimit) {
        runExperiment(base, powerLimit);
    }
};
  