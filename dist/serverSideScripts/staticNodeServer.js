/**
 * Very simple static nodejs server.
 *
 *
 * Usage:
 *      var sws         = require("./sws.js");
 *      var config      = {port : XXXX, rootFolder: XXX,[HOST]}; //port - Number, rootFolder - String, HOST - String
 *      sws.start(config);
 *
 */

var net = require("net");
var fs = require("fs");
var sws =
{
    checkRootFolder : function(rootFolderName)
    {
        if(rootFolderName === "/")
        {
            return "./";
        }
        return rootFolderName;
    },

    start: function (config)
    {
        var HOST;
        var port = config.port;
        var rootFolder = config.rootFolder;

        if(config.hasOwnProperty("HOST")){
            HOST = config.HOST;
        } else {
            HOST = "127.0.0.1";
        }


        rootFolder = sws.checkRootFolder(rootFolder);

        net.createServer(
            function (socket)
            {

                socket.on('data', function (data)
                {
                    var requestObj = sws.trimRequest(data);

                    if(requestObj.requestFullPath === "/")
                    {
                        requestObj.requestFullPath = "/index.html";
                    }
                    var path = rootFolder + requestObj.requestFullPath;
                    console.log(path);

                    fs.exists(path, function(exist)
                    {

                        if(exist)
                        {
                            fs.stat(path, function(err, stats)
                            {
                                if(err)
                                {
                                    console.log("error");
                                    sws.createResponse(socket,500, 0, "text/plain");
                                    throw err;
                                }
                                if(stats.isFile())
                                {
                                    var fileName = path.substring(path.lastIndexOf("/") + 1);
                                    sws.createResponse(socket, 200, stats.size, sws.getFileType(fileName));
                                    var readStream = fs.createReadStream(path);
                                    readStream.pipe(socket);
                                }
                                else
                                {
                                    sws.createResponse(socket, 500, 0, "text/plain");
                                    socket.end();
                                }
                            });

                        }
                        else
                        {
                            sws.createResponse(socket, 404, 0, "text/plain");
                            socket.end();
                        }
                    });

                });
                socket.on("close", function (data)
                {
                    socket.end();
                });

            }).listen(config.port, HOST);
    },


    createResponse : function(socket, code, sizeOfContent, fileType)
    {
        //("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 10\r\n\r\n");
        var statusCode = "";
        var httpVersion = "HTTP/1.0";
        var contentType = "Content-Type: " + fileType + "\r\n";
        var contentLength = "Content-Length: " + sizeOfContent + "\r\n\r\n";
        var response = "";

        switch (code)
        {
            case 200 :
                //statusCode = "200 OK";
                response = httpVersion + " " + "200 OK" + "\r\n" + contentType + contentLength;
                break;
            case 404:
                //statusCode = "404 Not Found";
                response = httpVersion + " " + "404 Not Found" + "\r\n"+ contentType + contentLength;
                break;
            case 500 :
                //statusCode = "500 Internal Server Error";
                response = httpVersion + " " + "500 Internal Server Error" + "\r\n"+ contentType + contentLength;
                break;
            default :
                //statusCode = "500 Internal Server Error";
                response = httpVersion + " " + "500 Internal Server Error" + "\r\n"+ contentType + contentLength;
        }

        socket.write(response);

    },


    getFileType : function(fileName)
    {
        //Mapping file type to the appropriate header
        var name = fileName.split(".");
        var ext = name.pop();

        var extTypes = {
            "3gp"   : "video/3gpp"
            , "a"     : "application/octet-stream"
            , "ai"    : "application/postscript"
            , "aif"   : "audio/x-aiff"
            , "aiff"  : "audio/x-aiff"
            , "asc"   : "application/pgp-signature"
            , "asf"   : "video/x-ms-asf"
            , "asm"   : "text/x-asm"
            , "asx"   : "video/x-ms-asf"
            , "atom"  : "application/atom+xml"
            , "au"    : "audio/basic"
            , "avi"   : "video/x-msvideo"
            , "bat"   : "application/x-msdownload"
            , "bin"   : "application/octet-stream"
            , "bmp"   : "image/bmp"
            , "bz2"   : "application/x-bzip2"
            , "c"     : "text/x-c"
            , "cab"   : "application/vnd.ms-cab-compressed"
            , "cc"    : "text/x-c"
            , "chm"   : "application/vnd.ms-htmlhelp"
            , "class"   : "application/octet-stream"
            , "com"   : "application/x-msdownload"
            , "conf"  : "text/plain"
            , "cpp"   : "text/x-c"
            , "crt"   : "application/x-x509-ca-cert"
            , "css"   : "text/css"
            , "csv"   : "text/csv"
            , "cxx"   : "text/x-c"
            , "deb"   : "application/x-debian-package"
            , "der"   : "application/x-x509-ca-cert"
            , "diff"  : "text/x-diff"
            , "djv"   : "image/vnd.djvu"
            , "djvu"  : "image/vnd.djvu"
            , "dll"   : "application/x-msdownload"
            , "dmg"   : "application/octet-stream"
            , "doc"   : "application/msword"
            , "dot"   : "application/msword"
            , "dtd"   : "application/xml-dtd"
            , "dvi"   : "application/x-dvi"
            , "ear"   : "application/java-archive"
            , "eml"   : "message/rfc822"
            , "eps"   : "application/postscript"
            , "exe"   : "application/x-msdownload"
            , "f"     : "text/x-fortran"
            , "f77"   : "text/x-fortran"
            , "f90"   : "text/x-fortran"
            , "flv"   : "video/x-flv"
            , "for"   : "text/x-fortran"
            , "gem"   : "application/octet-stream"
            , "gemspec" : "text/x-script.ruby"
            , "gif"   : "image/gif"
            , "gz"    : "application/x-gzip"
            , "h"     : "text/x-c"
            , "hh"    : "text/x-c"
            , "htm"   : "text/html"
            , "html"  : "text/html"
            , "ico"   : "image/vnd.microsoft.icon"
            , "ics"   : "text/calendar"
            , "ifb"   : "text/calendar"
            , "iso"   : "application/octet-stream"
            , "jar"   : "application/java-archive"
            , "java"  : "text/x-java-source"
            , "jnlp"  : "application/x-java-jnlp-file"
            , "jpeg"  : "image/jpeg"
            , "jpg"   : "image/jpeg"
            , "js"    : "application/javascript"
            , "json"  : "application/json"
            , "log"   : "text/plain"
            , "m3u"   : "audio/x-mpegurl"
            , "m4v"   : "video/mp4"
            , "man"   : "text/troff"
            , "mathml"  : "application/mathml+xml"
            , "mbox"  : "application/mbox"
            , "mdoc"  : "text/troff"
            , "me"    : "text/troff"
            , "mid"   : "audio/midi"
            , "midi"  : "audio/midi"
            , "mime"  : "message/rfc822"
            , "mml"   : "application/mathml+xml"
            , "mng"   : "video/x-mng"
            , "mov"   : "video/quicktime"
            , "mp3"   : "audio/mpeg"
            , "mp4"   : "video/mp4"
            , "mp4v"  : "video/mp4"
            , "mpeg"  : "video/mpeg"
            , "mpg"   : "video/mpeg"
            , "ms"    : "text/troff"
            , "msi"   : "application/x-msdownload"
            , "odp"   : "application/vnd.oasis.opendocument.presentation"
            , "ods"   : "application/vnd.oasis.opendocument.spreadsheet"
            , "odt"   : "application/vnd.oasis.opendocument.text"
            , "ogg"   : "application/ogg"
            , "p"     : "text/x-pascal"
            , "pas"   : "text/x-pascal"
            , "pbm"   : "image/x-portable-bitmap"
            , "pdf"   : "application/pdf"
            , "pem"   : "application/x-x509-ca-cert"
            , "pgm"   : "image/x-portable-graymap"
            , "pgp"   : "application/pgp-encrypted"
            , "pkg"   : "application/octet-stream"
            , "pl"    : "text/x-script.perl"
            , "pm"    : "text/x-script.perl-module"
            , "png"   : "image/png"
            , "pnm"   : "image/x-portable-anymap"
            , "ppm"   : "image/x-portable-pixmap"
            , "pps"   : "application/vnd.ms-powerpoint"
            , "ppt"   : "application/vnd.ms-powerpoint"
            , "ps"    : "application/postscript"
            , "psd"   : "image/vnd.adobe.photoshop"
            , "py"    : "text/x-script.python"
            , "qt"    : "video/quicktime"
            , "ra"    : "audio/x-pn-realaudio"
            , "rake"  : "text/x-script.ruby"
            , "ram"   : "audio/x-pn-realaudio"
            , "rar"   : "application/x-rar-compressed"
            , "rb"    : "text/x-script.ruby"
            , "rdf"   : "application/rdf+xml"
            , "roff"  : "text/troff"
            , "rpm"   : "application/x-redhat-package-manager"
            , "rss"   : "application/rss+xml"
            , "rtf"   : "application/rtf"
            , "ru"    : "text/x-script.ruby"
            , "s"     : "text/x-asm"
            , "sgm"   : "text/sgml"
            , "sgml"  : "text/sgml"
            , "sh"    : "application/x-sh"
            , "sig"   : "application/pgp-signature"
            , "snd"   : "audio/basic"
            , "so"    : "application/octet-stream"
            , "svg"   : "image/svg+xml"
            , "svgz"  : "image/svg+xml"
            , "swf"   : "application/x-shockwave-flash"
            , "t"     : "text/troff"
            , "tar"   : "application/x-tar"
            , "tbz"   : "application/x-bzip-compressed-tar"
            , "tcl"   : "application/x-tcl"
            , "tex"   : "application/x-tex"
            , "texi"  : "application/x-texinfo"
            , "texinfo" : "application/x-texinfo"
            , "text"  : "text/plain"
            , "tif"   : "image/tiff"
            , "tiff"  : "image/tiff"
            , "torrent" : "application/x-bittorrent"
            , "tr"    : "text/troff"
            , "txt"   : "text/plain"
            , "vcf"   : "text/x-vcard"
            , "vcs"   : "text/x-vcalendar"
            , "vrml"  : "model/vrml"
            , "war"   : "application/java-archive"
            , "wav"   : "audio/x-wav"
            , "wma"   : "audio/x-ms-wma"
            , "wmv"   : "video/x-ms-wmv"
            , "wmx"   : "video/x-ms-wmx"
            , "wrl"   : "model/vrml"
            , "wsdl"  : "application/wsdl+xml"
            , "xbm"   : "image/x-xbitmap"
            , "xhtml"   : "application/xhtml+xml"
            , "xls"   : "application/vnd.ms-excel"
            , "xml"   : "application/xml"
            , "xpm"   : "image/x-xpixmap"
            , "xsl"   : "application/xml"
            , "xslt"  : "application/xslt+xml"
            , "yaml"  : "text/yaml"
            , "yml"   : "text/yaml"
            , "zip"   : "application/zip"
        };
        return extTypes[ext.toLowerCase()];
    },



    paramsFromStringToArrayGET : function(params)
    {
        var objToReturn = {empty:true, vars:{}};
        var stringStrTok = params.split("&");

        for(var i = 0; i < stringStrTok.length; i++)
        {
            var arrSplitedByAssignmentSign = stringStrTok[i].split("=");
            if(arrSplitedByAssignmentSign.length === 2)
            {
                var fieldName = arrSplitedByAssignmentSign[0];
                var fieldData = arrSplitedByAssignmentSign[1];
                objToReturn.empty = false;
                objToReturn.vars[fieldName] = fieldData;
            } else
            {
                throw new Error("error in get params splice");
            }
        }


        return objToReturn;
    },
    getParamBody : function(requestPath)
    {
        //This method strips the params sent by the request into an object
        var indexOfQuestionToParams = requestPath.indexOf("?");
        if(indexOfQuestionToParams > -1)
        {
            var fileToBeFetched = requestPath.substring(0, indexOfQuestionToParams);
            var paramsAddedInGet = requestPath.substring(indexOfQuestionToParams + 1);

            var paramsAddedInGetArray = sws.paramsFromStringToArrayGET(paramsAddedInGet);
            paramsAddedInGetArray.realPath = fileToBeFetched;
            return paramsAddedInGetArray;

        }
        return {empty:true};
    },
    trimRequest: function (data)
    {
        // Skeleton to accpept all request types if wish to.
        var acceptableMethods = ["GET", "POST", "PUT", "DELETE"];
        var requestTypeFound = false;
        var requestParams = {};
        var dataAsString = data.toString();
        var requestLinesAsArray =  dataAsString.split("\n");
        requestLinesAsArray.forEach(function(lineFromRequest)
        {
            // trying to locate the request type
            if(!requestTypeFound)
            {
                // iterating on each acceptable method and trying to match in the line
                acceptableMethods.forEach(function(method)
                {
                    if(lineFromRequest.indexOf(method) > -1 && !requestTypeFound)
                    {

                        var firstLineInRequestToArray = lineFromRequest.split(" ");
                        requestParams['requestType'] = method;
                        requestParams['requestFullPath'] = firstLineInRequestToArray[1].replace(/(\r\n|\n|\r)/gm,"");
                        requestParams['requestHTTPVersion'] = firstLineInRequestToArray[2].replace(/(\r\n|\n|\r)/gm,"");



                        var seperatePathFromParams = sws.getParamBody(requestParams['requestFullPath']);
                        if(seperatePathFromParams.empty === false)
                        {
                            requestParams['RequestRealPath'] = seperatePathFromParams.realPath;
                            requestParams['args'] = seperatePathFromParams.vars;

                        }

                        requestTypeFound = true;

                    }
                });
            }
            else if(requestTypeFound)
            {
                var indexOfDoubleDots = lineFromRequest.indexOf(":");
                if(indexOfDoubleDots > -1)
                {
                    var fieldName = lineFromRequest.substring(0,indexOfDoubleDots);
                    var fieldData = lineFromRequest.substring(indexOfDoubleDots + 1).replace(/(\r\n|\n|\r)/gm,"");
                    if(fieldData.indexOf(" ") === 0)
                    {
                        var separateCharacter = fieldName.indexOf("-");
                        // casting to a non ' ' string
                        if(separateCharacter > -1)
                        {
                            fieldName = fieldName.substring(0, separateCharacter) + (fieldName.substring(separateCharacter + 1));
                        }
                        fieldData = fieldData.substring(1);

                    }

                    requestParams[fieldName] = fieldData;
                }
            }

        });
        return requestParams;
    },

    getFile: function (requestFullPath)
    {
        var pathsAsArr = requestFullPath.split("/");
        return pathsAsArr
    }

};

module.exports = sws;