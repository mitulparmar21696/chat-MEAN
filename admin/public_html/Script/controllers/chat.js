'use strict';
angular.module('DemoApp')
        .controller('chatCtrl', ['$scope', '$http', 'socket', '$localStorage', function ($scope, $http, socket, $localStorage) {
                //==============================================================
                //Declaration of variables
                //==============================================================
                $scope.user = {
                    userList: [],
                    messageHistory: [],
                    currentUser: {},
                    groups: [],
                    groupMember: []
                };
                $scope.isBlock = false;
                $scope.group = false;
                $scope.isSpam = false;
                $scope.userData = {};
                //==============================================================
                //Declaration of functions
                //==============================================================
                $scope.init = init;
                $scope.sendMessage = sendMessage;
                $scope.chatUser = chatUser;
                $scope.createModal = createModal;
                $scope.saveGroup = saveGroup;
                $scope.blockMember = blockMember;
                $scope.unBlockMember = unBlockMember;
                $scope.spam = spam;
                $scope.unspam = unspam;
                $scope.addMember = addMember;
                $scope.addToGroup = addToGroup;
                $scope.notifyMe = notifyMe;

                //==============================================================
                //Implimentation of functions
                //==============================================================

                //==============================================================
                function init() {
                    joinRoom();
                    getUserList();
                    socket.on('connect', function () {});
                }
                var joinRoom = function () {
                    socket.emit('online', {"room": $localStorage.loginData._id, "username": $localStorage.loginData.user_json.first_name});
                }
                function saveGroup() {
                    var groupName = {
                        'groupName': $scope.groupName,
                        'member': [
                            {
                                'member_id': $localStorage.loginData._id,
                                'first_name': $localStorage.loginData.user_json.first_name,
                                'last_name': $localStorage.loginData.user_json.last_name
                            }
                        ]
                    }
                    $http.post('http://127.0.0.1:8090/createGroup', groupName)
                            .then(function (response) {

                                if (response.data.result === true) {

                                    $('#createModal').modal('hide');
                                    getGroups();
                                }
                            });
                }
                function blockMember() {
                    $scope.isBlock = !$scope.isBlock;

                    var blockDetail = {
                        block_by: $localStorage.loginData._id,
                        blocked: $scope.chatId
                    }
                    socket.emit('blockUser', blockDetail);
                }
                function unBlockMember() {
                    $scope.isBlock = !$scope.isBlock;
                    var blockDetail = {
                        block_by: $localStorage.loginData._id,
                        blocked: $scope.chatId
                    };
                    socket.emit('unblockUser', blockDetail);
                }
                function spam() {
                    var spamData = {
                        spam_by: $localStorage.loginData._id,
                        spamed: $scope.chatId,
                        userDetails: $scope.userData
                    }
                    $http.post('http://127.0.0.1:8090/spam', spamData)
                            .then(function (response) {
                                $scope.isSpam = !$scope.isSpam;
                            });
                }
                function unspam() {
                    var spamData = {
                        spam_by: $localStorage.loginData._id,
                        spamed: $scope.chatId,
                    }
                    $http.post('http://127.0.0.1:8090/unspam', spamData)
                            .then(function (response) {
                                $scope.isSpam = !$scope.isSpam;
                            });
                }

                function addMember() {
                    $scope.user.groupMember = [];
                    $('#addMemberModel').modal('show');
                    $http.get('http://127.0.0.1:8090/getMemberList/' + $scope.chatId)
                            .then(function (response) {
                                if (response.data.result === true) {
                                    angular.forEach(response.data.memberList, function (value) {
                                        $scope.user.groupMember.push(value);
                                    });
                                }
                            });
                }
                function addToGroup(user, index) {

                    var members = {
                        _id: $scope.chatId,
                        'member_id': user._id,
                        'first_name': user.user_json.first_name,
                        'last_name': user.user_json.last_name
                    }

                    $http.post('http://127.0.0.1:8090/addMember', members)
                            .then(function (response) {
                                socket.emit('groupCreated', members);
                                $scope.user.groupMember.splice(index, 1);
                            });
                }
                function createModal() {
                    $('#createModal').modal('show');

                }
                function getUserList() {
                    $scope.user.userList = [];
                    $scope.user.currentUser = $localStorage.loginData;
                    $http.get('http://127.0.0.1:8090/getChatList/' + $localStorage.loginData._id)
                            .then(function (response) {
                                debugger;
                                if (response !== null) {
                                    if (response.data.User.length > 0) {
                                        angular.forEach(response.data.User, function (value) {
                                            if (value._id !== $scope.user.currentUser._id) {
                                                $scope.user.userList.push(constructUser(value));
                                            }
                                        });
                                        chatUser($scope.user.userList[0], 0);
                                        getGroups();
                                    }
                                }
                            });
                }
                function constructUser(user) {
                    return {
                        block: user.block,
                        _id: user._id,
                        msgCount: 0,
                        add_json: user.add_json,
                        user_json: user.user_json

                    }
                }

                function getGroups() {
                    debugger;
                    $http.get('http://127.0.0.1:8090/getGroups/' + $localStorage.loginData._id)
                            .then(function (response) {
                                debugger;
                                $scope.user.groups = [];
                                angular.forEach(response.data.data, function (value) {
                                    socket.emit('online', {"room": value._id, "groupName": value.groupName});
                                    $scope.user.groups.push(constructGroup(value));
                                });
                            });
                }
                function constructGroup(grp) {
                    debugger;
                    return {
                        groupName: grp.groupName,
                        member: grp.member,
                        _id: grp._id,
                        msgCount: 0
                    }
                }
                function chatUser(user, flag) {

                    $scope.userData = user;
                    $scope.isBlock = user.block;

                    if (flag === 0) {
                        angular.forEach($scope.user.userList, function (value) {
                            if (value._id === user._id) {
                                value.msgCount = 0;
                            }
                        });
                        $scope.group = false;
                        $scope.chatId = user._id;
                        getChat();
                    }
                    if (flag === 1) {
                        angular.forEach($scope.user.groups, function (value) {
                            if (value._id === user._id) {
                                value.msgCount = 0;
                            }
                        });
                        $scope.group = true;
                        $scope.chatId = user._id;
                        getGroupChat();
                    }
                }
                function getChat() {

                    $scope.user.messageHistory = [];

                    var msgDetail = {
                        from_user: $localStorage.loginData._id,
                        to_user: $scope.chatId
                    }
                    var userChat = {
                        user: msgDetail.from_user + msgDetail.to_user
                    };
                    $http.post('http://127.0.0.1:8090/getChat', userChat)
                            .then(function (response) {

                                if (response.data.data.length > 0) {
                                    angular.forEach(response.data.data, function (value) {
                                        $scope.user.messageHistory.push(value);
                                    });


                                    checkSpam();
                                }
                            });
                }
                function checkSpam() {
                    var spamData = {
                        spam_by: $localStorage.loginData._id,
                        spamed: $scope.chatId,
                    }

                    $http.post('http://127.0.0.1:8090/checkSpam', spamData)
                            .then(function (response) {

                                if (response.data.result === false) {
                                    $scope.isSpam = true;
                                } else {
                                    $scope.isSpam = false;
                                }
                            });
                }
                function getGroupChat() {
                    $scope.user.messageHistory = [];
                    $http.get('http://127.0.0.1:8090/getGroupChat/' + $scope.chatId)
                            .then(function (response) {

                                if (response !== null) {
                                    if (response.data.data.length > 0) {
                                        angular.forEach(response.data.data, function (value) {
                                            $scope.user.messageHistory.push(value);
                                        });
                                    }
                                }
                            });
                }

                function sendMessage() {
                    var username = $localStorage.loginData.user_json.first_name + ' ' + $localStorage.loginData.user_json.last_name;
                    if ($scope.group) {

                        var message = $scope.Message;
                        if (message.length <= 0) {
                            return false;
                        } else {
                            $scope.Message = "";
                            var chatData = {
                                "username": username,
                                "message": message,
                                "group": $scope.chatId,
                                "date": new Date().getTime(),
                                "from_user": $localStorage.loginData._id,
                                senduser: $localStorage.loginData._id,
                            };

                            $scope.user.messageHistory.push(chatData);
                            socket.emit('broadCastMessage', chatData);
                        }
                    } else {
                        var message = $scope.Message;
                        if (message.length <= 0) {
                            return false;
                        } else {
                            $scope.Message = "";
                            var chatData = {
                                "username": username,
                                "message": message,
                                "to_user": $scope.chatId,
                                "date": new Date().getTime(),
                                "from_user": $localStorage.loginData._id,
                                recieveuser: $scope.chatId,
                                senduser: $localStorage.loginData._id,
                            };

                            $scope.user.messageHistory.push(chatData);
                            socket.emit('sendmessage', chatData);
                        }
                    }

                }

                //Recive message from other users
                socket.on('receivemessage', function (username, data) {


                    socket.emit("sendrecive", data.sender);
                    data = data.reciver;
                    pushMessage(data.ops[0]);
                });
                socket.on('deployMesage', function (username, data) {
                    pushMessage(data.sender.ops[0]);
                    socket.emit("sendrecive", data.sender);

                });
                socket.on('receivemymessage', function (data) {

                });
                socket.on('refreshGroup', function (data) {
                    getGroups();
                });

                socket.on('getBlocked', function (data) {
                    getBlocked(data);
                });
                socket.on('unblockUser', function (data) {
                    getUserList();
                });
                function getBlocked(data) {
                    $scope.Users = [];
                    $scope.Users = $scope.user.userList;
                    $scope.user.userList = [];
                    angular.forEach($scope.Users, function (value) {
                        if (value._id !== $scope.user.currentUser._id) {
                            if (value._id !== data) {
                                $scope.user.userList.push(value);
                            }
                        }
                    });
                    chatUser($scope.user.userList[0], 0);
                }

                function pushMessage(data) {
                    debugger;
                    if (!angular.isUndefined(data.group)) {
                        if (data.group === $scope.chatId) {
                            $scope.user.messageHistory.push(data);
                        } else {
                            angular.forEach($scope.user.groups, function (value) {
                                if (value._id === data.group) {
                                    value.msgCount++;
                                }
                            });
                            notifyMe(data);
                        }
                    } else {
                        if (data.senduser === $scope.chatId) {
                            $scope.user.messageHistory.push(data);
                        } else {
                            angular.forEach($scope.user.userList, function (value) {
                                if (value._id === data.from_user) {
                                    value.msgCount++;
                                }
                            });
                            notifyMe(data);
                        }
                    }
                }
                ;
                function notifyMe(msg) {
                    debugger;
                    if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                    } else if (Notification.permission === "default" || Notification.permission === "granted" || Notification.permission === "denied") {
                        var options = {
                            body: msg.message,
                            icon: "icon.jpg",
                            dir: "ltr"
                        };
                        var notification = new Notification(msg.username, options);
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission(function (permission) {
                            if (!('permission' in Notification)) {
                                Notification.permission = permission;
                            }

                            if (permission === "granted") {
                                var options = {
                                    body: msg.message,
                                    icon: "icon.jpg",
                                    dir: "ltr"
                                };
                                var notification = new Notification(msg.username, options);
                            }
                        });
                    }
                }
            }]);

