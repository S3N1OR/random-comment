let participatingUsers = [];

function getRandomComment() {
  setTimeout(function () {
    const videoUrlInput = document.getElementById("video-url");
    const videoUrl = videoUrlInput.value;
    const videoId = getVideoId(videoUrl);

    if (!videoId) {
      alert("Неверный URL видеоролика на YouTube");
      return;
    }

    fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=AIzaSyDqHnVhdAh0lMy0SR5rIMo785bWIMmohvk`)
      .then(response => response.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          alert("Нет доступных комментариев для розыгрыша");
          return;
        }

        const filteredCommentThreads = data.items.filter(commentThread => !participatingUsers.includes(commentThread.snippet.topLevelComment.snippet.authorDisplayName));

        if (filteredCommentThreads.length === 0) {
          alert("Нет доступных комментариев для розыгрыша");
          return;
        }

        const randomCommentThread = filteredCommentThreads[Math.floor(Math.random() * filteredCommentThreads.length)];
        const comment = randomCommentThread.snippet.topLevelComment.snippet.textDisplay;
        const totalComments = data.pageInfo.totalResults;
        const userName = randomCommentThread.snippet.topLevelComment.snippet.authorDisplayName;
        const channelId = randomCommentThread.snippet.topLevelComment.snippet.authorChannelId.value;

        participatingUsers.push(userName);

        fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=AIzaSyDqHnVhdAh0lMy0SR5rIMo785bWIMmohvk`)
          .then(response => response.json())
          .then(channelData => {
            const avatarUrl = channelData.items[0].snippet.thumbnails.default.url;

            const commentElement = document.createElement("div");
            commentElement.classList.add('comment');
            commentElement.textContent = 'Комментарий: ';
            const commentSpan = document.createElement('span');
            commentSpan.innerHTML = comment;
            commentElement.appendChild(commentSpan);

            const userNameElement = document.createElement("div");
            userNameElement.classList.add('name');
            userNameElement.innerHTML = 'NickName: ';
            const userNameSpan = document.createElement('span');
            userNameSpan.innerHTML = userName;
            userNameElement.appendChild(userNameSpan);
            const copyName = document.createElement('div');
            copyName.classList.add('copy__name');
            userNameElement.appendChild(copyName);

            const totalCommentsElement = document.createElement("div");
            totalCommentsElement.classList.add('total__comments');
            totalCommentsElement.textContent = 'Всего комментариев под видео: ';
            const totalCommentsSpan = document.createElement('span');
            totalCommentsSpan.innerHTML = totalComments;
            totalCommentsElement.appendChild(totalCommentsSpan);

            const winnerCommentsElement = document.createElement('div');
            winnerCommentsElement.classList.add('winner__comments');
            winnerCommentsElement.textContent = 'Количество комментариев от победителя: ';
            const winnerCommentsSpan = document.createElement('span');
            winnerCommentsElement.appendChild(winnerCommentsSpan);

            const avatarElement = document.createElement("img");
            avatarElement.src = 'https://yt3.googleusercontent' + avatarUrl.replace(/^.{17}/, '');
            avatarElement.alt = "Аватар комментатора";
            avatarElement.classList.add("avatar");
            const avatarIcon = document.createElement('img');
            avatarIcon.src = './img/win-icon.png';
            avatarIcon.classList.add('win__icon');

            const winContent = document.getElementById('win');
            const winBlock = document.createElement('win');
            const winTitle = document.createElement('h4');
            winBlock.classList.add('win__block');
            winTitle.classList.add('win__title');
            winTitle.innerHTML = 'Победитель'
            winContent.innerHTML = '';
            winContent.appendChild(winTitle);
            winContent.appendChild(winBlock);
            winBlock.appendChild(avatarElement);
            winBlock.appendChild(avatarIcon);

            copyName.addEventListener('click', function () {
              var copyNameText = userName;

              navigator.clipboard.writeText(copyNameText);
            })

            const redDots = document.createElement('div');
            redDots.classList.add('dots');
            redDots.classList.add('red');
            const orangeDots = document.createElement('div');
            orangeDots.classList.add('dots');
            orangeDots.classList.add('orange');
            const greenDots = document.createElement('div');
            greenDots.classList.add('dots');
            greenDots.classList.add('green');

            const randomCommentTop = document.createElement('div');
            randomCommentTop.classList.add('random-comment-top');

            document.getElementById("random-comment").innerHTML = "";
            document.getElementById("random-comment").appendChild(redDots);
            document.getElementById("random-comment").appendChild(orangeDots);
            document.getElementById("random-comment").appendChild(greenDots);
            document.getElementById("random-comment").appendChild(userNameElement);
            document.getElementById("random-comment").appendChild(commentElement);
            document.getElementById("random-comment").appendChild(totalCommentsElement);
            document.getElementById("random-comment").appendChild(winnerCommentsElement);

            fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=AIzaSyDqHnVhdAh0lMy0SR5rIMo785bWIMmohvk&authorChannelId=${channelId}`)
              .then(response => response.json())
              .then(data => {
                const commentThreads = data.items;
                const winnerCommentsCount = commentThreads.filter(commentThread => commentThread.snippet.topLevelComment.snippet.authorChannelId.value === channelId).length;

                winnerCommentsSpan.textContent = winnerCommentsCount;
              })
              .catch(error => {
                console.error("Произошла ошибка:", error);
                alert("Произошла ошибка при получении количества комментариев от победителя");
              });
          })
          .catch(error => {
            console.error("Произошла ошибка:", error);
            alert("Произошла ошибка при получении информации о канале комментатора");
          });
      })
      .catch(error => {
        console.error("Произошла ошибка:", error);
        alert("Произошла ошибка при получении комментариев");
      });

    document.querySelector('.random-comment').classList.remove('none');
    document.getElementById('random-comment').classList.add('spin1');
    document.getElementById('win').classList.add('spin2');
    setTimeout(function () {
      document.getElementById('random-comment').classList.remove('spin1');
      document.getElementById('win').classList.remove('spin2');
    }, 2000)
  }, 100)

}

function getVideoId(url) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function clearUrl() {
  const videoUrlInput = document.getElementById("video-url");
  videoUrlInput.value = '';
}

function copy() {
  var copyText = 'https://github.com/S3N1OR/random-comment';

  navigator.clipboard.writeText(copyText);
}