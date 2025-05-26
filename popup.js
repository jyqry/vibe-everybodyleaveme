// 팝업이 로드될 때 실행
document.addEventListener("DOMContentLoaded", async () => {
  const commentsToggle = document.getElementById("commentsToggle");
  const liveChatToggle = document.getElementById("liveChatToggle");
  const status = document.getElementById("status");

  // 저장된 설정 불러오기
  try {
    const result = await chrome.storage.sync.get([
      "removeComments",
      "removeLiveChat",
    ]);

    commentsToggle.checked = result.removeComments || false;
    liveChatToggle.checked = result.removeLiveChat || false;

    updateStatus();
  } catch (error) {
    console.error("설정 로드 실패:", error);
    status.textContent = "설정 로드에 실패했습니다.";
  }

  // 댓글 토글 이벤트
  commentsToggle.addEventListener("change", async () => {
    try {
      await chrome.storage.sync.set({ removeComments: commentsToggle.checked });
      await sendMessageToContentScript();
      updateStatus();
    } catch (error) {
      console.error("댓글 설정 저장 실패:", error);
    }
  });

  // 라이브 채팅 토글 이벤트
  liveChatToggle.addEventListener("change", async () => {
    try {
      await chrome.storage.sync.set({ removeLiveChat: liveChatToggle.checked });
      await sendMessageToContentScript();
      updateStatus();
    } catch (error) {
      console.error("라이브 채팅 설정 저장 실패:", error);
    }
  });

  // 현재 탭에 메시지 전송
  async function sendMessageToContentScript() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.url && tab.url.includes("youtube.com")) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "updateSettings",
          removeComments: commentsToggle.checked,
          removeLiveChat: liveChatToggle.checked,
        });
      }
    } catch (error) {
      console.error("콘텐츠 스크립트 메시지 전송 실패:", error);
    }
  }

  // 상태 업데이트
  function updateStatus() {
    const commentsStatus = commentsToggle.checked ? "숨김" : "표시";
    const chatStatus = liveChatToggle.checked ? "숨김" : "표시";

    status.innerHTML = `
      댓글: <strong>${commentsStatus}</strong><br>
      라이브 채팅: <strong>${chatStatus}</strong>
    `;
  }

  // 초기 메시지 전송
  await sendMessageToContentScript();
});
