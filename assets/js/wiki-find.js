
function openWikiSearch() {
  document.getElementById("wiki-search-box").style.display = "block";
}

function searchWikipedia() {
  const query = document.getElementById("wiki-query").value.trim();
  const resultDiv = document.getElementById("wiki-result");
  resultDiv.innerHTML = "🔍 Đang tìm kiếm...";

  if (!query) {
    resultDiv.innerHTML = "❗ Vui lòng nhập từ khóa.";
    return;
  }

  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error("Không tìm thấy bài viết.");
      return res.json();
    })
    .then(data => {
      resultDiv.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.extract}</p>
        <a href="${data.content_urls.desktop.page}" target="_blank">🔗 Xem chi tiết</a>
      `;
    })
    .catch(err => {
      resultDiv.innerHTML = "❌ Không tìm thấy thông tin phù hợp.";
    });
}

