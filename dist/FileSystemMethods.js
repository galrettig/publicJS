/**
 * Created by gal on 12/23/2015.
 */
var fs = require("fs");
var FileSystemMethods = {
    /**
     * @description inserting all the given files in a given path (Directory) into the given Array, if optinal is to filter the results with allowed file extensions and folders to ignore(by name)
     * @param path
     * @param finalFiles
     * @param optional allowedExtension
     * @param optional ignoreFolders
     * @returns the final array
     */
    insertAllFilesFromPathToArray: function (path, finalFiles, allowedExtension, ignoreFolders)
    {
        allowedExtension = allowedExtension || [];
        ignoreFolders = ignoreFolders || [];
        var validExtension = function (extensions, fileName)
        {
            if (fileName === undefined && extensions.length !== 0)
            {
                return false;
            }
            if(extensions.length === 0){
                return true;
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
                    var recArray = this.insertAllFilesFromPathToArray(currentPath,finalFiles, allowedExtension, ignoreFolders);
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