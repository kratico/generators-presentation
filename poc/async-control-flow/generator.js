(function() {
  // Utils
  function request(url) {
    return new Promise(function(resolve, reject) {
      $.get(url, resolve);
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

  function co(genFunc) {
    var genObj = genFunc();
    run();

    function run(promiseResult) {
      var result = genObj.next(promiseResult);
      if (!result.done) {
        // A Promise was yielded
        result.value
          .then(function(result) {
            run(result);
          })
          .catch(function(error) {
            genObj.throw(error);
          });
      }
    }
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
    var usersPromises = userIds.map(function(userId) {
      return getUser(userId);
    });
    var users = yield Promise.all(usersPromises);
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
