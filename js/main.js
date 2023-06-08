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
      const commentThread = data.items[Math.floor(Math.random() * data.items.length)];
      const comment = commentThread.snippet.topLevelComment.snippet.textDisplay;
      const totalComments = data.pageInfo.totalResults;
      const userName = commentThread.snippet.topLevelComment.snippet.authorDisplayName;
      const avatarUrl = commentThread.snippet.topLevelComment.snippet.authorProfileImageUrl;

      const commentElement = document.createElement("div");
      commentElement.textContent = `Комментарий: ${comment}`;

      const userNameElement = document.createElement("div");
      userNameElement.textContent = `Имя пользователя: ${userName}`;

      const totalCommentsElement = document.createElement("div");
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
