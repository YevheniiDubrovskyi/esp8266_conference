var fs = require('fs');

fs.readFile('/proc/net/arp', function(err, data) {
    if (!!err) return done(err, null);

    var output = [];
    var devices = data.toString().split('\n');
    devices.splice(0,1);

    for (i = 0; i < devices.length; i++) {
        var cols = devices[i].replace(/ [ ]*/g, ' ').split(' ');

        if ((cols.length > 3) && (cols[0].length !== 0) && (cols[3].length !== 0) && cols[3] !== '00:00:00:00:00:00') {
            output.push({
                ip: cols[0],
                mac: cols[3]
            });
        }
    }

    console.log(output);
});
