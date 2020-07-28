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
        var size = Math.pow(2, power);
        var concatDuration = runConcatExperiment(base, power, size);
        var arrayJoinDuration = runArrayJoinExperiment(base, power, size);
        results.push({
            base: base,
            power: power, 
            size: size,
            concatDuration: concatDuration,
            arrayJoinDuration: arrayJoinDuration
        });
    }
    return results;
}

module.exports = {
    run: function (base, powerLimit) {
        runExperiment(base, powerLimit);
    }
};
  