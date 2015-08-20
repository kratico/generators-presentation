(function() {
  // Utils
  function request(url) {
    // See https://api.jquery.com/jquery.get/
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

  function getUsersForTweets() {
    return getTweets()
      .then(function(tweets) {
        var userIds = getUniqueUserIds(tweets);
        var usersPromises = userIds.map(function(userId) {
          return getUser(userId);
        });
        return Promise.all(usersPromises);
      });
  }

  function getUsersForTweets2() {
    return request('api/tweets.json')
      .then(function(tweets) {
        return Promise.all([
          request('api/user-' + tweets[0].userId + '.json'),
          request('api/user-' + tweets[1].userId + '.json'),
          request('api/user-' + tweets[2].userId + '.json')
        ]);
      });
  }

  getUsersForTweets()
    .then(function(results) {
      console.log(results);
    })
    .catch(function(reason) {
      console.error(reason);
    });

  // getUsersForTweets2()
  //   .then(function(results) {
  //     console.log(results);
  //   });


}());
