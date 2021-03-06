// Service for chat stuff
companionApp.factory('ChatService', function ($rootScope, Companion) {
  var numOnlineUsers = 0;
  var onlineUsers = [];

  var listRef = new Firebase('https://companion-simulation.firebaseio.com/presence/');
  var userRef = listRef.child(Companion.getUser().uid); // This creates a unique reference for each user
  var presenceRef = new Firebase('https://companion-simulation.firebaseio.com/.info/connected');

  // Add ourselves to presence list when online.
  presenceRef.on('value', function(snapshot) {
    if (snapshot.val()) {
      // Remove ourselves when we disconnect, has to be before, to prevent ghosts
      userRef.onDisconnect().remove();
      userRef.set(Companion.getUser());
    }
  });

  // Get the users and notify the application
  listRef.on('value', function(snap) {
    numOnlineUsers = snap.numChildren();
    onlineUsers = [];
    angular.forEach(snap.val(), function(value, key) {
      this.push(value);
    }, onlineUsers);
    $rootScope.$broadcast('onOnlineUser');
  });

  this.getOnlineUserCount = function() {
    return numOnlineUsers;
  }

  this.getOnlineUsers = function() {
    return onlineUsers;
  }

  return this;
});
