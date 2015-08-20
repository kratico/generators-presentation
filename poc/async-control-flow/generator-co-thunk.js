(function() {
  // Utils
  function request(url) {
    return function(cb) {
      $.get(url, function(result) {
        cb(null, result);
      })
      .fail(function(jqXHR, status, error) {
        cb(error);
      });
    };
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
  function getTweets() {
    return request('api/tweets.json');
  }

  function getUser(userId) {
    return request('api/user-' + userId + '.json');
  }

  co(function* getUsersForTweets() {
    var tweets = yield getTweets();
    var userIds = getUniqueUserIds(tweets);
    var users = yield userIds.map(function(userId) {
      return getUser(userId);
    });
    return users;
  })(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
  });

  // co(function* getUsersForTweets2() {
  //   var users = [];
  //   try {
  //     var tweets = yield getTweets();
  //     var userIds = getUniqueUserIds(tweets);
  //     users = yield userIds.map(function(userId) {
  //       return getUser(userId);
  //     });
  //   } catch (ex) {
  //     console.error(ex);
  //   }
  //   return users;
  // })(function (err, users) {
  //   if (err) return console.error(err);
  //   console.log(users);
  // });

}());
