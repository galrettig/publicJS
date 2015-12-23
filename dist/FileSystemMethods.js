/**
 * Created by gal on 12/23/2015.
 */
var fs = require("fs");
var FileSystemMethods = {
    getFiles: function (path, allowedExtension, ignoreFolders, finalFiles)
    {

        var validExtension = function (extensions, fileName)
        {
            if (fileName === undefined)
            {
                return false;
            }
            var indexOfExtStart = fileName.indexOf(".");
            if (indexOfExtStart > -1)
            {
                var ext = fileName.substr(indexOfExtStart);
                return (extensions.indexOf(ext) > -1);
            }
            return false;
        };

        var findings = fs.readdirSync(path);
        var currentPath = path;

        for (var i = 0; i < findings.length; i++)
        {

            currentPath = path + "\\" + findings[i];
            var stats = fs.statSync(currentPath);

            if (stats.isDirectory())
            {

                if (ignoreFolders.indexOf(findings[i]) === -1)
                {
                    var recArray = getFiles(currentPath, allowedExtension, ignoreFolders, finalFiles);
                    if (recArray.length > 0)
                    {
                        finalFiles.concat(recArray);
                    }
                }
            }
            else if (stats.isFile())
            {
                if (validExtension(allowedExtension, findings[i]))
                {
                    finalFiles.push(currentPath);
                }
            }
        }

        return finalFiles;
    }
};

module.exports = FileSystemMethods;