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
    getTweets(function(err, tweets) {
      var userIds = getUniqueUserIds(tweets);
      async.map(userIds, getUser, function(err, results) {
        cb(null, results);
      });
    });
  }

  function getUsersForTweets2(cb) {
    request('api/tweets.json', function(err, tweets) {
      async.map(
        ['api/user-' + tweets[0].userId + '.json',
         'api/user-' + tweets[1].userId + '.json',
         'api/user-' + tweets[2].userId + '.json'],
        request,
        function(err, results) {
          cb(null, results);
        }
      );
    });
  }

  getUsersForTweets(function(err, results) {
    console.log(results);
  });

  // getUsersForTweets2(function(err, results) {
  //   console.log(results);
  // });

}());
