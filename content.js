// EverybodyLeaveMe - YouTube 댓글 및 라이브 채팅 숨김 콘텐츠 스크립트

class YouTubeCommentRemover {
  constructor() {
    this.settings = {
      removeComments: false,
      removeLiveChat: false,
    };

    this.observers = [];
    this.init();
  }

  async init() {
    // 저장된 설정 로드
    await this.loadSettings();

    // 페이지 로드 완료 대기
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.startObserving()
      );
    } else {
      this.startObserving();
    }

    // 메시지 리스너 등록
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "updateSettings") {
        this.settings.removeComments = request.removeComments;
        this.settings.removeLiveChat = request.removeLiveChat;
        this.applySettings();
        sendResponse({ success: true });
      }
    });
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        "removeComments",
        "removeLiveChat",
      ]);
      this.settings.removeComments = result.removeComments || false;
      this.settings.removeLiveChat = result.removeLiveChat || false;
    } catch (error) {
      console.error("설정 로드 실패:", error);
    }
  }

  startObserving() {
    // 초기 적용
    this.applySettings();

    // DOM 변화 감지를 위한 MutationObserver
    const observer = new MutationObserver((mutations) => {
      let shouldApply = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldApply = true;
        }
      });

      if (shouldApply) {
        // 디바운스를 위해 약간의 지연
        setTimeout(() => this.applySettings(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observers.push(observer);

    // URL 변화 감지 (YouTube는 SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => this.applySettings(), 500);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  applySettings() {
    if (this.settings.removeComments) {
      this.removeComments();
    } else {
      this.restoreComments();
    }

    if (this.settings.removeLiveChat) {
      this.removeLiveChat();
    } else {
      this.restoreLiveChat();
    }

    // 영화관 모드 변화 감지를 위한 추가 체크
    this.checkTheaterMode();
  }

  checkTheaterMode() {
    const theaterModeActive = document.querySelector(
      "ytd-watch-flexy[theater]"
    );
    if (theaterModeActive && this.settings.removeLiveChat) {
      // 영화관 모드에서 라이브 채팅이 활성화된 경우 강제로 다시 제거
      setTimeout(() => {
        this.removeLiveChat();
      }, 100);
    }
  }

  removeComments() {
    // 다양한 댓글 섹션 선택자들
    const commentSelectors = [
      "#comments",
      "#comment-section",
      "ytd-comments",
      "ytd-comments-header-renderer",
      "ytd-comment-thread-renderer",
      "ytd-comments-entry-point-header-renderer",
      '[data-content-type="comments"]',
      ".ytd-comments",
      "#primary #comments",
      'ytd-item-section-renderer[section-identifier="comment-item-section"]',
    ];

    commentSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element && !element.hasAttribute("data-comment-hidden")) {
          element.style.display = "none";
          element.setAttribute("data-comment-hidden", "true");
        }
      });
    });

    // 댓글 로딩 스피너도 제거
    const spinners = document.querySelectorAll(
      "ytd-comments ytd-continuation-item-renderer"
    );
    spinners.forEach((spinner) => {
      if (spinner) {
        spinner.style.display = "none";
      }
    });
  }

  restoreComments() {
    const hiddenComments = document.querySelectorAll(
      '[data-comment-hidden="true"]'
    );
    hiddenComments.forEach((element) => {
      element.style.display = "";
      element.removeAttribute("data-comment-hidden");
    });
  }

  removeLiveChat() {
    // 라이브 채팅 관련 선택자들 (기본 모드와 영화관 모드 구분)
    const liveChatSelectors = [
      "#chat",
      "#chat-container",
      "#chatframe",
      "ytd-live-chat-frame",
      "yt-live-chat-app",
      'iframe[src*="live_chat"]',
      '[data-content-type="live-chat"]',
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-live-chat"]',
      "#panels ytd-engagement-panel-section-list-renderer",
      "ytd-live-chat-frame#chat",
      ".ytd-live-chat-frame",
      // 기본 모드에서 secondary 내 라이브 채팅만
      "#secondary #chat",
      "#secondary ytd-live-chat-frame",
      "#secondary-inner #chat",
      "#secondary-inner ytd-live-chat-frame",
      // 추가 라이브 채팅 컨테이너들
      "ytd-live-chat-frame[collapsed]",
      "ytd-live-chat-frame[hidden]",
      "#live-chat-iframe",
      ".live-chat-iframe",
      "yt-live-chat-renderer",
      "#show-hide-button", // 채팅 숨기기/보이기 버튼
      // 전체 너비 패널 컨테이너
      "#panels-full-bleed-container",
      ".panels-full-bleed-container",
      "ytd-watch-flexy #panels-full-bleed-container",
    ];

    // 영화관 모드에서만 적용할 추가 선택자들
    const theaterModeSelectors = [
      "ytd-watch-flexy[theater] #chat",
      "ytd-watch-flexy[theater] ytd-live-chat-frame",
    ];

    // 기본 라이브 채팅 선택자들 처리
    liveChatSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element && !element.hasAttribute("data-chat-hidden")) {
          element.style.display = "none !important";
          element.style.visibility = "hidden !important";
          element.style.opacity = "0 !important";
          element.style.height = "0 !important";
          element.style.width = "0 !important";
          element.style.overflow = "hidden !important";
          element.setAttribute("data-chat-hidden", "true");
        }
      });
    });

    // 영화관 모드에서만 추가 선택자들 처리
    const isTheaterMode = document.querySelector("ytd-watch-flexy[theater]");
    if (isTheaterMode) {
      theaterModeSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element && !element.hasAttribute("data-chat-hidden")) {
            element.style.display = "none !important";
            element.style.visibility = "hidden !important";
            element.style.opacity = "0 !important";
            element.style.height = "0 !important";
            element.style.width = "0 !important";
            element.style.overflow = "hidden !important";
            element.setAttribute("data-chat-hidden", "true");
          }
        });
      });
    }

    // 채팅 패널 버튼들 숨기기 (더 포괄적)
    const chatButtons = document.querySelectorAll(
      '[aria-label*="채팅"], [aria-label*="Chat"], [aria-label*="chat"], button[data-target-id="engagement-panel-live-chat"], .ytp-live-chat-button, .ytp-button[data-tooltip-target-id*="chat"]'
    );
    chatButtons.forEach((button) => {
      if (button && !button.hasAttribute("data-chat-button-hidden")) {
        button.style.display = "none !important";
        button.setAttribute("data-chat-button-hidden", "true");
      }
    });

    // 영화관 모드에서만 secondary 영역 완전 제거
    const currentTheaterMode = document.querySelector(
      "ytd-watch-flexy[theater]"
    );
    if (currentTheaterMode) {
      const secondaryArea = document.querySelector("#secondary");
      if (secondaryArea && !secondaryArea.hasAttribute("data-theater-hidden")) {
        secondaryArea.style.display = "none !important";
        secondaryArea.setAttribute("data-theater-hidden", "true");
      }
    } else {
      // 기본 모드에서는 secondary 영역 복원하되 라이브 채팅만 제거
      const secondaryArea = document.querySelector("#secondary");
      if (secondaryArea && secondaryArea.hasAttribute("data-theater-hidden")) {
        secondaryArea.style.display = "";
        secondaryArea.removeAttribute("data-theater-hidden");
      }
    }

    // 라이브 채팅 관련 스타일 클래스 제거
    document.body.classList.add("youtube-comment-remover-no-chat");
  }

  restoreLiveChat() {
    const hiddenChats = document.querySelectorAll('[data-chat-hidden="true"]');
    hiddenChats.forEach((element) => {
      element.style.display = "";
      element.style.visibility = "";
      element.style.opacity = "";
      element.style.height = "";
      element.style.width = "";
      element.style.overflow = "";
      element.removeAttribute("data-chat-hidden");
    });

    const hiddenChatButtons = document.querySelectorAll(
      '[data-chat-button-hidden="true"]'
    );
    hiddenChatButtons.forEach((button) => {
      button.style.display = "";
      button.removeAttribute("data-chat-button-hidden");
    });

    // 영화관 모드 secondary 영역 복원
    const hiddenTheaterAreas = document.querySelectorAll(
      '[data-theater-hidden="true"]'
    );
    hiddenTheaterAreas.forEach((area) => {
      area.style.display = "";
      area.removeAttribute("data-theater-hidden");
    });

    // 라이브 채팅 관련 스타일 클래스 제거
    document.body.classList.remove("youtube-comment-remover-no-chat");
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.restoreComments();
    this.restoreLiveChat();
  }
}

// 확장 프로그램 초기화
const youtubeCommentRemover = new YouTubeCommentRemover();

// 페이지 언로드 시 정리
window.addEventListener("beforeunload", () => {
  youtubeCommentRemover.destroy();
});
