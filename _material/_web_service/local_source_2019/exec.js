var exec = require('child_process').exec;
exports.execute = (path) => {
    var cmd=`explorer.exe ${path}`;
    exec(cmd, function(error, stdout, stderr) {
        if(error){
            console.log(error);
        }
        else{
            console.log("成功");
        }
    });
}
// execute();