(function() {
  // Utils
  function request(url) {
    return new Promise(function(resolve, reject) {
      $.get(url, resolve)
      .fail(function(jqXHR, status, error) {
        reject(error);
      });
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
  function getTweets() {
    return request('api/tweets.json');
  }

  function getUser(userId) {
    return request('api/user-' + userId + '.json');
  }

  // co(function* getUsersForTweets() {
  //   var tweets = yield getTweets();
  //   var userIds = getUniqueUserIds(tweets);
  //   var usersPromises = userIds.map(function(userId) {
  //     return getUser(userId);
  //   });
  //   var users = yield Promise.all(usersPromises);
  //   return users;
  // })(function (err, users) {
  //   if (err) return console.error(err);
  //   console.log(users);
  // });

  co(function* getUsersForTweets2() {
    var users = [];
    try {
      var tweets = yield getTweets();
      users = yield getUniqueUserIds(tweets).map(getUser);
    } catch (ex) {
      console.error(ex);
    }
    return users;
  })(function(err, users) {
    if (err) return console.error(err);
    console.log(users);
  });

  // co(function* getUsersForTweets2() {
  //   var tweets = yield request('api/tweets.json');
  //   var users = yield Promise.all([
  //     request('api/user-' + tweets[0].userId + '.json'),
  //     request('api/user-' + tweets[1].userId + '.json'),
  //     request('api/user-' + tweets[2].userId + '.json')
  //   ]);
  //   console.log(users);
  // });

}());
