(function() {
  // Utils
  function request(url, cb) {
    // See https://api.jquery.com/jquery.get/
    $.get(url, function(result) {
      cb(null, result);
    });
  }

  function getUniqueUserIds(tweets) {
    return tweets.reduce(function(acc, tweet) {
      if (acc.indexOf(tweet.userId) === -1) {
        acc.push(tweet.userId);
      }
      return acc;
    }, []);
  }

  // Async fns
  function getTweets(cb) {
    request('api/tweets.json', cb);
  }

  function getUser(userId, cb) {
    request('api/user-' + userId + '.json', cb);
  }

  function getUsersForTweets(cb) {
    request('api/tweets.json', function(err, tweets) {
      var pending = tweets.length;
      var users = new Array(tweets.length);
      tweets.forEach(function(tweet, i) {
        request('api/user-' + tweet.userId + '.json', function(err, user) {
          users[i] = user;
          --pending || cb(null, users);
        });
      });
    });
  }

  function getUsersForTweets2(cb) {
    request('api/tweets.json', function(err, tweets) {
      var userIds = getUniqueUserIds(tweets);
      var pending = userIds.length;
      var users = new Array(userIds.length);
      userIds.forEach(function(userId, i) {
        request('api/user-' + userId + '.json', function(err, user) {
          users[i] = user;
          --pending || cb(null, users);
        });
      });
    });
  }

  getUsersForTweets(function(err, results) {
    console.log(results);
  });

}());
