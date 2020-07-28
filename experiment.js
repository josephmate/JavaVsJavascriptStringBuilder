function runConcatExperiment(size) {
    var result = "";
    var start = new Date().getTime();
    for (var i = 0; i < size; i++) {
        result += (i%10);
    }
    var end = new Date().getTime();
    var duration = end - start;
    console.log("concat %d %d %d", size, result.length, duration);
    return duration;
}

function runArrayJoinExperiment(size) {
    var builder = [];
    var start = new Date().getTime();
    for (var i = 0; i < size; i++) {
        builder.push(i%10);
    }
    var result = builder.join();
    var end = new Date().getTime();
    var duration = end - start;
    console.log("concat %d %d %d", size, result.length, duration);
    return duration;
}

function runExperiment() {
    var baseInput = document.getElementById("base");
    var base = baseInput.value;
    var powerLimitInput = document.getElementById("powerLimit");
    var powerLimit = powerLimitInput.value;
    var results = [];
    for(var power = 1; power <= powerLimit; power++) {
        var size = Math.pow(2, power);
        var concatDuration = runConcatExperiment(size);
        var arrayJoinDuration = runArrayJoinExperiment(size);
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