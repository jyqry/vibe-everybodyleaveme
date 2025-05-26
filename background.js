// EverybodyLeaveMe - Background Service Worker

// 확장 프로그램 설치 시 초기 설정
chrome.runtime.onInstalled.addListener(async () => {
  console.log("EverybodyLeaveMe 확장 프로그램이 설치되었습니다.");

  // 기본 설정 저장
  try {
    const result = await chrome.storage.sync.get([
      "removeComments",
      "removeLiveChat",
    ]);

    if (result.removeComments === undefined) {
      await chrome.storage.sync.set({ removeComments: false });
    }

    if (result.removeLiveChat === undefined) {
      await chrome.storage.sync.set({ removeLiveChat: false });
    }

    console.log("기본 설정이 저장되었습니다.");
  } catch (error) {
    console.error("기본 설정 저장 실패:", error);
  }
});

// 탭 업데이트 감지
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // YouTube 페이지가 로드 완료되었을 때
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("youtube.com")
  ) {
    try {
      // 현재 설정 가져오기
      const result = await chrome.storage.sync.get([
        "removeComments",
        "removeLiveChat",
      ]);

      // 콘텐츠 스크립트에 설정 전송
      await chrome.tabs.sendMessage(tabId, {
        action: "updateSettings",
        removeComments: result.removeComments || false,
        removeLiveChat: result.removeLiveChat || false,
      });
    } catch (error) {
      // 콘텐츠 스크립트가 아직 로드되지 않았을 수 있음
      console.log("콘텐츠 스크립트 메시지 전송 대기 중...");
    }
  }
});

// 확장 프로그램 아이콘 클릭 시 (팝업이 없는 경우 대비)
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.url.includes("youtube.com")) {
    try {
      // 현재 설정 토글
      const result = await chrome.storage.sync.get([
        "removeComments",
        "removeLiveChat",
      ]);
      const newCommentsState = !result.removeComments;
      const newChatState = !result.removeLiveChat;

      await chrome.storage.sync.set({
        removeComments: newCommentsState,
        removeLiveChat: newChatState,
      });

      // 콘텐츠 스크립트에 업데이트 전송
      await chrome.tabs.sendMessage(tab.id, {
        action: "updateSettings",
        removeComments: newCommentsState,
        removeLiveChat: newChatState,
      });

      console.log(
        `설정 업데이트: 댓글 ${newCommentsState ? "숨김" : "표시"}, 채팅 ${
          newChatState ? "숨김" : "표시"
        }`
      );
    } catch (error) {
      console.error("설정 토글 실패:", error);
    }
  }
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    chrome.storage.sync
      .get(["removeComments", "removeLiveChat"])
      .then((result) => {
        sendResponse({
          removeComments: result.removeComments || false,
          removeLiveChat: result.removeLiveChat || false,
        });
      })
      .catch((error) => {
        console.error("설정 가져오기 실패:", error);
        sendResponse({ error: error.message });
      });

    return true; // 비동기 응답을 위해 true 반환
  }
});

// 스토리지 변경 감지
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    console.log("설정이 변경되었습니다:", changes);

    // 모든 YouTube 탭에 변경사항 전파
    chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
      tabs.forEach(async (tab) => {
        try {
          const result = await chrome.storage.sync.get([
            "removeComments",
            "removeLiveChat",
          ]);
          await chrome.tabs.sendMessage(tab.id, {
            action: "updateSettings",
            removeComments: result.removeComments || false,
            removeLiveChat: result.removeLiveChat || false,
          });
        } catch (error) {
          // 일부 탭에서는 콘텐츠 스크립트가 로드되지 않았을 수 있음
          console.log("일부 탭에 메시지 전송 실패:", error.message);
        }
      });
    });
  }
});
