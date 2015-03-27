angular.module('starter.controllers', ["firebase"])


.controller('DashController' , function($scope) {

        $scope.lsUser = localStorage.getItem('firebase:session::emessage');
        $scope.myUser = JSON.parse($scope.lsUser);

        $scope.getdata = function(){
            $scope.lsUser = localStorage.getItem('firebase:session::emessage');
            $scope.myUser = JSON.parse($scope.lsUser);
        }

    })

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})


.controller("contact", function($scope, $firebase){

        //var CON = new Firebase("https://vivid-fire-7876.firebaseio.com/");
        var commentsRef = CON.child('comments');
        var commentsSync = $firebase(commentsRef);

        $scope.comments = commentsSync.$asArray();

        //$scope.messages = [];

        $scope.contact = {
            firstname : "",
            lastname : "",
            comments : "",
            time : ""
        };


        $scope.submitComment = function(){
            //alert($scope.message.text);

            var msg = {
                firstname : $scope.contact.firstname,
                lastname : $scope.contact.lastname,
                comments : $scope.contact.comments,
                time : Date.now()
            };
            $scope.comments.$add(msg);
        }
})


.controller("ChatsCtrl",  function($scope, $firebase, $ionicPopup, $state){

        //$location.hash('bottom');

        //$anchorScroll();

        $scope.lsUser = localStorage.getItem('firebase:session::emessage');
         $scope.user = JSON.parse($scope.lsUser);


        if (!$scope.user){
            $ionicPopup.alert({
                title: "Oops",
                template: "It looks like you're not Signed In, Please Sign In Or Register"
        });
            $state.go('tab.account')
        }
})

    .controller('socialChat', function ($scope, $firebase) {

        $scope.lsUser = localStorage.getItem('firebase:session::emessage');
        $scope.user = JSON.parse($scope.lsUser);

        var ref = new Firebase("https://emessage.firebaseio.com/");
        var messageRef = ref.child('messages');
        $scope.messages = $firebase(messageRef).$asArray();

        $scope.msg = {
            text: '',
            user: '',
            time: ''
        };


        $scope.send = function () {
            if ($scope.msg.text) {
                $scope.messages.$add({
                    text: $scope.msg.text,
                    user: $scope.user.password.email,
                    time: Date.now()
                });
                $scope.msg = {};
            }
        };
    })

    .controller('educationalChat', function ($scope, $firebase) {

        $scope.lsUser = localStorage.getItem('firebase:session::emessage');
        $scope.user = JSON.parse($scope.lsUser);

            var ref = new Firebase("https://emessage.firebaseio.com/");
            var messageRef = ref.child('education');
            $scope.messages = $firebase(messageRef).$asArray();

            $scope.msg = {
                text: '',
                user: '',
                time: ''
            };


            $scope.send = function () {
                if ($scope.msg.text) {
                    $scope.messages.$add({
                        text: $scope.msg.text,
                        user: $scope.user.password.email,
                        time: Date.now()
                    });
                    $scope.msg = {};
                }
            };
    })



    .controller('AccountController', function($scope, $ionicPopup) {

        var ref = new Firebase("https://emessage.firebaseio.com/");

        //$scope.auth = $firebaseAuth(ref);

        var myUser = localStorage.getItem('firebase:session::emessage');
        $scope.myUser = JSON.parse(myUser);

        $scope.user = {
            email : '',
            passwaord: '',
            data: ''
        };

        $scope.register = function () {
/*            $scope.auth.$createUser($scope.user.email, $scope.user.password).then(function(){
             console.log("User created successfully!");

             return $scope.authObj.$authWithPassword({
             email: $scope.user.email,
             password: $scope.user.password
             });
             }).then(function(authData) {
             console.log("Logged in as:", authData.uid);
             $scope.user.id = authData.uid;
             }).catch(function(error) {
             console.error("Error: ", error);
             });*/

            ref.createUser({
                email    : $scope.user.email,
                password : $scope.user.password
            }, function(error) {
                if (error === null) {
                    console.log("User created successfully");


                    ref.authWithPassword({
                        email    : $scope.user.email,
                        password : $scope.user.password
                    }, function(error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);

                            function authDataCallback(authData) {
                                if (authData) {
                                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                                    $scope.myUser =  authData;
                                    $ionicPopup.alert({
                                        title: 'Register Success!',
                                        template: 'logged in as ' + $scope.myUser.password.email
                                    })
                                } else {
                                    console.log("User is logged out");
                                }
                            }
                            // Register the callback to be fired every time auth state changes
                            ref.onAuth(authDataCallback);
                        }
                    });

                } else {
                    console.log("Error creating user:", error);
                }
            })

        };

        $scope.login = function () {

/*            $scope.auth.$authWithPassword({
                email: $scope.user.email,
                password: $scope.user.password
            }).then(function(authData){
                console.log(authData);
                $scope.user.id = authData.uid;
             var user = JSON.stringify(authData);
                sessionStorage.setItem('signedInUser', user)
            }).catch(function(error) {
                console.error("Error: " + error);
            });*/

            ref.authWithPassword({
                email    : $scope.user.email,
                password : $scope.user.password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);

                    function authDataCallback(authData) {
                        if (authData) {
                            console.log("User " + authData.uid + " is logged in with " + authData.provider);
                            $scope.myUser =  authData;
                            $ionicPopup.alert({
                                            title: 'Login Success!',
                                            template: 'logged in as ' + $scope.myUser.password.email
                                        })
                        } else {
                            console.log("User is logged out");
                        }
                    }
                    // Register the callback to be fired every time auth state changes
                    ref.onAuth(authDataCallback);

                    var authdata = ref.getAuth();

                    if (authdata) {
                        console.log("User " + authdata.uid + " is logged in with " + authdata.provider);
                    } else {
                        console.log("User is logged out");
                    }
                }
            })
        };


        $scope.logout = function () {
             $scope.user = {};
            $scope.myUser = {};
             localStorage.clear();
             ref.unauth();
            //$state.go()
            //$state.reload('tab.account')
            //$state.go('.')
            //$state.go('tab.chats');
             }

         }
            );







