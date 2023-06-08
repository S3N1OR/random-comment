let participatingUsers = [];

function getRandomComment() {
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
      const filteredCommentThreads = data.items.filter(commentThread => !participatingUsers.includes(commentThread.snippet.topLevelComment.snippet.authorDisplayName));

      if (filteredCommentThreads.length === 0) {
        alert("Нет доступных комментариев для розыгрыша");
        return;
      }

      const randomCommentThread = filteredCommentThreads[Math.floor(Math.random() * filteredCommentThreads.length)];
      const comment = randomCommentThread.snippet.topLevelComment.snippet.textDisplay;
      const totalComments = data.pageInfo.totalResults;
      const userName = randomCommentThread.snippet.topLevelComment.snippet.authorDisplayName;
      const avatarUrl = randomCommentThread.snippet.topLevelComment.snippet.authorProfileImageUrl;

      participatingUsers.push(userName);

      const commentElement = document.createElement("div");
      commentElement.classList.add('comment');
      commentElement.textContent = `Комментарий: ${comment}`;

      const userNameElement = document.createElement("div");
      userNameElement.classList.add('name');
      userNameElement.textContent = `Имя пользователя: ${userName}`;

      const totalCommentsElement = document.createElement("div");
      totalCommentsElement.classList.add('totalComments');
      totalCommentsElement.textContent = `Количество комментариев: ${totalComments}`;

      const avatarElement = document.createElement("img");
      avatarElement.src = avatarUrl;
      avatarElement.alt = "Аватар комментатора";
      avatarElement.classList.add("avatar");

      const userInfoElement = document.createElement("div");
      userInfoElement.appendChild(avatarElement);
      userInfoElement.appendChild(userNameElement);

      document.getElementById("random-comment").innerHTML = "";
      document.getElementById("random-comment").appendChild(userInfoElement);
      document.getElementById("random-comment").appendChild(commentElement);
      document.getElementById("random-comment").appendChild(totalCommentsElement);
    })
    .catch(error => {
      console.error("Произошла ошибка:", error);
      alert("Произошла ошибка при получении комментариев");
    });
}

function getVideoId(url) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function clearUrl(){
  const videoUrlInput = document.getElementById("video-url");
  videoUrlInput.value = '';
}