
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require("fs");
var cors = require('cors');
var jsonPath = '/home/samcom/Html/NodeServer/DemoServer/public/users.json';
var shareJobPath = '/home/samcom/Html/NodeServer/DemoServer/public/post_job.json';
var bodyParser = require('body-parser');
var multer = require('multer');
var mongo = require('mongodb');
var assert = require('assert');
var path = require('path');
var async = require('async');
var BSON = mongo.BSONPure;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/testdb";
var nodemailer = require("nodemailer");
var waterfall = require('async-waterfall');
var objectID = require('mongodb').ObjectID;
var database;
var io = require('socket.io')(http);
var forEach = require('async-foreach').forEach;
var admin = require('firebase-admin')
var serviceAccount = require('./fir-realtimedatabase-e8ded-firebase-adminsdk-whzql-07173bb989.json')
var serviceAccount1 = require('./notificationdemo-7a6d0-firebase-adminsdk-h0dr9-b7f74373b6.json')

var registrationToken = "eGyuUOWxe-Q:APA91bH94SsvYaxeb9Lvc_zqOBqqztv8bDNJVWQQHpeCaYBWz8zRTYgX6HlaVqocQemuHdsZyqKy1ucWQGwmqJ559N6SojP7vHy0cRfYh69LPqPaU_pqNVmhyfLCPJBB-FWwOMdPU2QH"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-realtimedatabase-e8ded.firebaseio.com"
})

MongoClient.connect(url, function (err, db) {
    database = db;
    console.log("Mongo Db Connected");
    var server = http.listen(8090, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log("Example app listening at http://%s:%s", host, port);
    });


});
app.use(bodyParser.json({ inflate: true, limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
//var urlencodedParser = bodyParser.urlencoded({extended: true});

app.use(cors());
//get data from json
app.get('/listUsers', function (req, res) {
    fs.readFile('/home/samcom/Html/NodeServer/DemoServer/public/users.json', 'utf8', function (err, data) {
        res.end(data);
    });
});
// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log('get blank')
    // var registrationToken="eJmlqtCvQho:APA91bFqttO3nlht1pNpizdClT97DC_hDFoh0q-HpFVEyW4L98pmxFTCjuc8Dwvzn1NZAnDxsPn6RAQCvv1UapMZ3ZhSwMzXdlkqDTY2T54kVATiqAkM8RzaBSRUfRgFmS27LUDRnWhi"
    var message = {
        // android: {
        //     "data": {
        //         "myPAra":"123456",
        //         "status": "2",
        //         "title": "Android Himashu",
        //         "message": "We are testing in android oreo notification please check once",
        //         "image-url":
        //           "http://www.techread.in/wp-content/uploads/2017/12/oreo.png"
        //       }
        //   },
        apns: {
            headers: {
                'apns-priority': '10'
            },
            payload: {
                aps: {
                    alert: {
                        title: 'Hello2',
                        body: 'Good morning',
                    },
                    badge: 0,
                    "data": {
                        'val': 123
                    }
                },
            }
        },
        token: registrationToken,
    };

    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
});

app.get('/getNotice', function (req, res) {
    console.log('get notification')
    var message = {
        data: {    //This is only optional, you can send any data
            score: '850',
            time: '2:45'
        },
        notification: {
            title: 'Title of notification',
            body: 'Body of notification'
        },
        token: registrationToken
    };
    FCM.send(message, function (err, response) {
        if (err) {
            console.log('error found', err);
        } else {
            console.log('response here', response);
        }
    })

});



app.get('/index.htm', function (req, res) {
    res.sendFile("/home/samcom/Html/NodeServer/DemoServer/Html/index.htm");
});
app.get('/process_get', function (req, res) {
    //fs.writeFile(, JSON.stringify(req.query, null, 2));
    fs.readFile(jsonPath, function (err, data) {
        var json = JSON.parse(data);
        json.push(req.query);
        fs.writeFile(jsonPath, JSON.stringify(json));
    });
    // Prepare output in JSON format
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    };
    res.end(JSON.stringify(response));
});

app.post('/saveShareJobs', function (req, res) {
    // Prepare output in JSON format
    var query = {
        '_id': mongo.ObjectID(req.body.userId)
    };
    var userQuery = {
        'userId': req.body.userId
    };

    try {
        async.waterfall([
            function (callback) {
                database.collection('Users').findOne(query, function (err, data) {
                    callback(null, data)
                });
            },
            function (arg1, callback) {
                database.collection('shareJob').find(userQuery).toArray(function (err, data) {
                    callback(null, data, arg1);
                });
            },
            function (arg2, arg3, callback) {
                if (arg2.length < arg3.user_json.planDetails.Job) {
                    database.collection("shareJob").insert(req.body, function (err, User) {
                        callback(null, User)
                    });
                } else {
                    callback(null, "Upgrade Your Plan");
                }
            }
        ], function (error, data) {
            if (error) {
                //handle readFile error or processFile error here
                res.send({ error: error });
            } else {
                res.send({ data: data });
            }
        });

    } catch (err) {
        res.send({ err: err });
    }


});
app.get('/shareJobList', function (req, res) {
    database.collection('shareJob').find().toArray(function (err, ShareJob) {
        if (err) {
            res.send({ err: err });
        } else {
            res.send({ ShareJob: ShareJob });
        }
    });
});
app.get('/getUserList', function (req, res) {
    database.collection('Users').find().toArray(function (err, User) {
        if (err) {
            res.send({ err: err });
        } else {
            res.send({ User: User });
        }
    });
});
//Save USer
app.post('/process_post', function (req, res) {
    // Prepare output in JSON format
    database.collection("Users").insert(req.body, function (err, User) {
        if (err) {
            res.send({ err: err });
        } else {
            res.send({ User: User });
        }
    });
});
app.post('/spaceShare', function (req, res) {
    // Prepare output in JSON format
    database.collection("spaceshare").insert(req.body, function (err, spaceshare) {
        if (err) {
            res.send({ err: err });
        } else {
            res.send({ spaceshare: spaceshare });
        }
    });
});
var storage = multer.diskStorage({//multers disk storage settings

    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //        var datetimestamp = Date.now();
        cb(null, +Date.now() + file.originalname);
        //        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({//multer settings
    storage: storage
}).any();
/** API path that will upload the files */
app.post('/upload', function (req, res) {
    try {
        upload(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            res.json({ error_code: 0, file: req.files });
        });
    } catch (err) {
        res.json({ error_code: 1, err_desc: err });
    }
});
//exports.updateWine = function(req, res) {
app.post('/updateSpace', function (req, res) {
    // Prepare output in JSON format
    try {
        database.collection("uploads").insert(req.body, function (err, spaceshare) {
            if (err) {
                res.send({ err: err });
            }
            res.send({ spaceshare: spaceshare });
        });
    } catch (err) {
        res.json({ error_code: 1, err_desc: err });
    }

});

app.post('/login', function (req, res) {
    var query = {
        'user_json.email': req.body.email,
        'user_json.password': req.body.password,
    };
    try {
        if (req.body.role === 'Admin') {
            database.collection("Users").findOne(query, function (err, data) {
                if (data !== null) {
                    var val1 = new Date().getTime();
                    var val2 = Math.floor((Math.random() * 1000000) + 1);
                    var token = val1 + val2;
                    res.json({ login: data, token: token });
                } else {
                    res.status(401).send('No User Found');
                }
            });
        } else {
            database.collection("Users").findOne({ 'user_json.email': req.body.email }, function (err, data) {
                if (data !== null) {
                    var val1 = new Date().getTime();
                    var val2 = Math.floor((Math.random() * 1000000) + 1);
                    var token = val1 + val2;
                    res.json({ login: data, token: token });
                } else {
                    res.status(401).send('No User Found');
                }
            });
        }
    } catch (err) {
        res.json({ error_code: 1, err_desc: err });
    }
});

app.get('/spaceShareList', function (req, res) {
    try {
        database.collection('spaceshare').find().toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});


app.get('/image/:id', function (req, res) {
    var query = {
        '_id': req.params.id
    };
    try {
        database.collection('uploads').findOne(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                var imageData = [];
                for (var i = 0; i < data.images.length; i++) {
                    var b64 = new Buffer(fs.readFileSync(data.images[i].path)).toString("base64");
                    imageData.push({ b64: b64 });
                }
                res.json({ imageData: imageData, id: query });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }

});

app.delete('/deleteSpace/:id', function (req, res) {
    var query = {
        '_id': req.params.id
    };
    var queryId = {
        '_id': mongo.ObjectID(req.params.id)
    };
    try {
        async.parallel([
            function (callback) {
                database.collection('spaceshare').remove(queryId, function (err, data) {
                    callback(err, data);
                });
            },
            function (callback) {
                database.collection('uploads').remove(query, function (err, data) {
                    callback(err, data);
                });
            }
        ], function (err, result) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ result: true });
            }

        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/saveShareType', function (req, res) {
    try {
        database.collection('spaceShareType').insert(req.body, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }

});

app.get('/getShareType', function (req, res) {
    try {
        database.collection('spaceShareType').find().toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});
app.post('/updateShareType', function (req, res) {
    var myQuery = { '_id': mongo.ObjectID(req.body._id) };
    var toUpdate = { $set: { 'englishName': req.body.englishName, 'frenchName': req.body.frenchName } };
    try {
        database.collection('spaceShareType').update(myQuery, toUpdate, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {

    }
});
app.delete('/deleteShareSpace/:id', function (req, res) {
    var query = { '_id': mongo.ObjectID(req.params.id) };
    try {
        database.collection('spaceShareType').remove(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ response: true });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }

});

app.post('/saveCategory', function (req, res) {
    try {
        database.collection('spaceCategory').insert(req.body, function (err, data) {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ data: data })
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.get('/getCategories', function (req, res) {
    try {
        database.collection('spaceCategory').find().toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.delete('/deleteSpaceCategory/:id', function (req, res) {
    var query = {
        '_id': req.params.id
    };
    var queryId = {
        '_id': mongo.ObjectID(req.params.id)
    };
    try {
        async.parallel([
            function (callback) {
                database.collection('spaceCategory').remove(queryId, function (err, data) {
                    callback(err, data);
                });
            },
            function (callback) {
                database.collection('uploads').remove(query, function (err, data) {
                    callback(err, data);
                });
            }
        ], function (err, result) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ response: true });
            }

        });
    } catch (err) {
        res.send({ err: err });
    }

});

app.post('/saveFacilities', function (req, res) {
    try {
        database.collection('spaceFacilities').insert(req.body, function (err, data) {
            if (err) {
                res.send({ err: err })
            } else {
                res.send({ data: data })
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.get('/getFacilities', function (req, res) {
    try {
        database.collection('spaceFacilities').find().toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.delete('/deleteSpaceFacility/:id', function (req, res) {
    var query = { '_id': mongo.ObjectID(req.params.id) };
    try {
        database.collection('spaceFacilities').remove(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ response: true });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }

});

app.post('/updateFacilities', function (req, res) {
    var myQuery = { '_id': mongo.ObjectID(req.body._id) };
    var toUpdate = { $set: { 'englishName': req.body.englishName, 'frenchName': req.body.frenchName } };
    try {
        database.collection('spaceFacilities').update(myQuery, toUpdate, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {

    }
});



app.delete('/deleteCategoryImage/:id', function (req, res) {
    var query = { '_id': req.params.id };
    try {
        database.collection('uploads').remove(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ response: true });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/updateCategory', function (req, res) {
    var myQuery = { '_id': mongo.ObjectID(req.body._id) };
    var toUpdate = {
        $set: {
            'englishName': req.body.englishName,
            'frenchName': req.body.frenchName,
            'tarifPerMonth': req.body.tarifPerMonth
        }
    };
    try {
        database.collection('spaceCategory').update(myQuery, toUpdate, function (err, data) {
            if (err) {
                res.send({ err: err })
            } else {
                res.send(data)
            }
        });

    } catch (err) {
        res.send(err)
    }
});
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "",
        pass: ""
    }
});

app.get('/send', function (req, res) {
    var mailOptions = {
        to: req.query.to,
        subject: req.query.subject,
        text: req.query.text
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.end("error");
        } else {
            res.end("sent");
        }
    });

});

app.post('/updatePlanDetail', function (req, res) {
    var myQuery = { '_id': mongo.ObjectID(req.body._id) };
    var toUpdate = {
        $set: {
            'user_json.planDetails.Job': req.body.Job,
            'user_json.planDetails.Workspaces': req.body.Workspaces,
            'user_json.planDetails.Events': req.body.Events,
            'user_json.planDetails.Communities': req.body.Communities
        }
    };
    try {
        database.collection('Users').update(myQuery, toUpdate, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {

    }
});

app.post('/registerSpace', function (req, res) {
    var querySpaceId = {
        'spaceId': req.body.spaceId
    }

    global.flag = true;
    try {
        async.waterfall([
            function (callback) {
                database.collection('spaceRegistrations').find(querySpaceId).toArray(function (err, spaceRegList) {
                    if (spaceRegList === null) {
                        callback(null, true);
                    } else {
                        callback(null, spaceRegList);
                    }
                });
            },
            function (checkReg, callback) {
                var timeList = [];
                if (checkReg === true) {
                    callback(null, true);
                } else {
                    for (var i = 0; i < checkReg.length; i++) {
                        if (checkReg[i].spaceDate === req.body.spaceDate) {
                            timeList.push(checkReg[i]);
                        }
                    }
                    callback(null, timeList);
                }
            },
            function (doReg, callback) {
                var RegArr = new Array();
                RegArr = doReg;
                if (doReg === true) {
                    callback(null, true);
                } else {
                    checkTime();
                    function checkTime() {
                        if (doReg.length !== 0 && global.flag === true) {
                            getTime(RegArr[0]);
                        } else {
                            if (global.flag === true) {
                                callback(null, true);
                            } else {
                                callback(null, false);
                            }
                        }
                    }
                    function getTime(item) {

                        var FromTime = new Date();
                        var parts = item.FromTime.split(":");
                        FromTime.setHours(parts[0], parts[1], 0, 0);

                        var ToTime = new Date();
                        parts = item.ToTime.split(":");
                        ToTime.setHours(parts[0], parts[1], 0, 0);

                        var EnFrTime = new Date();
                        parts = req.body.FromTime.split(":");
                        EnFrTime.setHours(parts[0], parts[1], 0, 0);

                        var EnToTime = new Date();
                        parts = req.body.ToTime.split(":");
                        EnToTime.setHours(parts[0], parts[1], 0, 0);
                        RegArr.splice(0, 1);

                        if (EnFrTime.getTime() > FromTime.getTime()) {
                            if (EnFrTime.getTime() > ToTime.getTime()) {
                                checkTime();
                            } else {
                                global.flag = false;
                                checkTime();
                            }
                        } else
                            if (EnFrTime.getTime() < FromTime.getTime()) {
                                if (EnToTime.getTime() < FromTime.getTime()) {
                                    checkTime();
                                } else {
                                    global.flag = false;
                                    checkTime();
                                }
                            } else {
                                global.flag = false;
                                checkTime();
                            }
                    }
                }
            },
            function (RegCom, callback) {
                if (RegCom === true) {
                    database.collection('spaceRegistrations').insert(req.body, function (err, data) {
                        callback(null, data);
                    });
                } else {
                    callback(null, { insert: false, msg: "Already Registered Please Choose another time or date" });
                }
            }
        ], function (error, data) {
            if (error) {
                //handle readFile error or processFile error here
                res.send({ error: error });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/getChat', function (req, res) {
    var query = req.body.user;
    try {
        database.collection('chats').find({ $or: [{ 'user': req.body.user }, { 'userOne': req.body.user }] }).toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});
io.on('connection', function (socket) {
    var rooms = [];
    socket.on("online", function (data) {
        //This socket event call once user login and ready for chat
        rooms[socket.id] = data;
        socket.join(data.room);
    });

    socket.on("sendrecive", function (data) {
        //            socket.on("sendmymsg")
        socket.in(data.from_user).emit('receivemymessage', data);
    });

    socket.on('blockUser', function (data) {
        database.collection('Block').insert(data, function (err, annos) {
            if (err) {
            } else {
                var json = { _id: mongo.ObjectID(data.block_by) };
                database.collection("Users").findOne(json, function (err, annos) {
                    if (data === null) {
                    } else {
                        socket.in(data.blocked).emit('getBlocked', annos._id, 'Blocked');
                    }
                });
            }
        });
    });
    socket.on('groupCreated', function (data) {
        socket.in(data.member_id).emit('refreshGroup', data)
    });
    socket.on('unblockUser', function (data) {
        database.collection('Block').remove(data, function (err, message) {
            if (err) {
            } else {
                var json = { _id: mongo.ObjectID(data.block_by) };
                database.collection("Users").findOne(json, function (err, annos) {
                    if (data === null) {
                    } else {
                        socket.in(data.blocked).emit('unblockUser', annos._id, 'Blocked');
                    }
                });
            }
        });
    });
    socket.on('broadCastMessage', function (data) {
        var ChatData = {
            username: data.username,
            from_user: data.from_user,
            group: data.group,
            message: data.message,
            date: data.date,
            senduser: data.from_user,
            status: 1,
        };
        database.collection("groupChat").insert(ChatData, function (err, boostedData) {
            if (err) {
            } else {
                addedData.sender = boostedData;
                var json = { _id: mongo.ObjectID(data.from_user) };
                database.collection("Users").findOne(json, function (err, annos) {
                    if (data === null) {

                    } else {
                        socket.in(data.group).emit('deployMesage', annos._id, addedData);
                    }
                });
            }
        });
        var addedData = {};
    });
    socket.on('sendmessage', function (data) {
        var ChatData = {
            username: data.username,
            from_user: data.from_user,
            to_user: data.to_user,
            message: data.message,
            date: data.date,
            recieveuser: data.to_user,
            senduser: data.from_user,
            status: 1,
            user: data.from_user + data.to_user,
            userOne: data.to_user + data.from_user
        };

        var blockQuery = {
            $or: [
                { block_by: data.to_user, blocked: data.from_user },
                { block_by: data.from_user, blocked: data.to_user }
            ]
        }
        var spamQuery = {
            spam_by: data.to_user,
            spamed: data.from_user
        }
        database.collection("spamUser").findOne(spamQuery, function (err, spam) {
            if (err) {

            } else {
                if (spam !== null) {
                    spamed();
                } else {
                    notSpamed();
                }
            }
        });
        function spamed() {
            database.collection("Block").findOne(blockQuery, function (err, Block) {
                if (err) {

                } else {
                    if (Block !== null) {
                    } else {
                        database.collection("spam").insert(ChatData, function (err, boostedData) {
                            if (err) {

                            } else {

                            }
                        });
                    }
                }
            });
        }
        function notSpamed() {
            database.collection("Block").findOne(blockQuery, function (err, Block) {
                if (err) {

                } else {
                    if (Block !== null) {
                    } else {
                        database.collection("chats").insert(ChatData, function (err, boostedData) {
                            if (err) {

                            } else {
                                addedData.reciver = boostedData;
                                addedData.sender = boostedData;
                                var json = { _id: mongo.ObjectID(data.from_user) };
                                database.collection("Users").findOne(json, function (err, annos) {
                                    if (data === null) {

                                    } else {
                                        socket.in(data.to_user).emit('receivemessage', annos._id, addedData);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        var addedData = {};
    });
});

app.get('/getGroupChat/:id', function (req, res) {
    try {
        database.collection('groupChat').find({ 'group': req.params.id }).toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/createGroup', function (req, res) {
    try {
        database.collection('group').insert(req.body, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data, result: true });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.get('/getGroups/:id', function (req, res) {
    var query = {
        $or: [
            { 'member.member_id': req.params.id.toString() }
        ]
    }
    console.log(query)
    try {
        database.collection('group').find(query).toArray(function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.get('/getChatList/:id', function (req, res) {
    var chatList = [];
    var users = [];
    database.collection('Users').find().toArray(function (err, Userlist) {
        if (err) {
            res.send({ err: err });
        } else {
            users = Userlist;
            async.forEach(users, function (user, callback) {
                var query = { 'block_by': req.params.id.toString(), 'blocked': user._id.toString() }
                console.log(query)
                database.collection('Block').findOne(query, function (err, BlockList) {
                    if (err) {
                        res.send({ err: err });
                    } else {
                        if (BlockList === null) {
                            user.block = false;
                            chatList.push(user);
                            callback()
                        } else {
                            user.block = true;
                            chatList.push(user);
                            callback()
                        }
                    }
                });
                // tell async that that particular element of the iterator is done
            }, function (err) {
                if (err) {
                    res.send({ err: err, result: false });
                } else {
                    res.send({ User: chatList, result: true });
                }
            });
        }
    });
});

app.post('/spam', function (req, res) {
    try {
        database.collection('spamUser').insert(req.body, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/unspam', function (req, res) {
    try {
        database.collection('spamUser').remove(req.body, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/checkSpam', function (req, res) {
    var query = req.body;
    try {
        database.collection('spamUser').findOne(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                if (data === null) {
                    res.send({ data: data, result: true, message: 'not spammed user' });
                } else {
                    res.send({ data: data, result: false, message: 'spammed user' });
                }
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.get('/getMemberList/:id', function (req, res) {
    var memberList = [];
    try {
        database.collection('Users').find().toArray(function (err, data) {
            var userList = data;
            if (err) {

            } else {

                async.forEach(userList, function (user, callback) {

                    var query = {
                        _id: mongo.ObjectID(req.params.id),
                        $or: [
                            { 'member.member_id': user._id.toString() }
                        ]
                    }
                    database.collection('group').find(query).toArray(function (err, grpMember) {
                        if (err) {

                        } else {
                            if (grpMember.length === 0) {
                                memberList.push(user);

                            }
                            callback();
                        }

                    });
                    // tell async that that particular element of the iterator is done
                }, function (err) {
                    if (err) {
                        res.send({ err: err, result: false });
                    } else {
                        res.send({ memberList: memberList, result: true });
                    }
                });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});

app.post('/addMember', function (req, res) {
    var myQuery = { '_id': mongo.ObjectID(req.body._id) };
    var toUpdate = {
        $push: {
            'member': {
                'member_id': req.body.member_id,
                'first_name': req.body.first_name,
                'last_name': req.body.last_name
            }
        }
    };
    try {
        database.collection('group').update(myQuery, toUpdate, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                res.send({ data: data });
            }
        });
    } catch (err) {
        res.send({ err: err });
    }
});
app.get('/getUserImage/:id', function (req, res) {
    var query = {
        '_id': req.params.id
    };
    try {
        database.collection('uploads').findOne(query, function (err, data) {
            if (err) {
                res.send({ err: err });
            } else {
                console.log('images', data)
                if (data !== null) {
                    var filepath = data.images[0].path;
                    fs.stat(filepath, function (err, stat) {
                        if (err === null) {
                            fs.createReadStream(filepath).pipe(res);
                        } else if (err.code === 'ENOENT') {
                            // file does not exist
                            //fs.writeFile('log.txt', 'Some log\n');
                        } else {
                        }
                    });
                } else {
                    res.send({ image: false })
                }
            }
        });
    } catch (err) {
        res.send({ err: err })
    }
});