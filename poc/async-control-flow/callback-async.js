(function() {
  // Utils
  function request(url, cb) {
    // See https://api.jquery.com/jquery.get/
    $.get(url, function(result) {
      cb(null, result);
    })
    .fail(function(jqXHR, status, error) {
      cb(error);
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
      async.map(userIds, getUser, cb);
    });
  }

  function getUsersForTweets2(cb) {
    request('api/tweets.json', function(err, tweets) {
      async.map(
        ['api/user-' + tweets[0].userId + '.json',
         'api/user-' + tweets[1].userId + '.json',
         'api/user-' + tweets[2].userId + '.json'],
        request,
        cb
      );
    });
  }

  function getUsersForTweets3(cb) {
    async.waterfall([
      getTweets,
      async.asyncify(getUniqueUserIds),
      function(userIds, next) {
        async.map(userIds, getUser, next);
      }
    ], cb);
  }

  getUsersForTweets(function(err, results) {
    if (err) return console.error(err);
    console.log(results);
  });

  // getUsersForTweets2(function(err, results) {
  //   console.log(results);
  // });
  //
  // getUsersForTweets3(function(err, results) {
  //   console.log(results);
  // });

}());
