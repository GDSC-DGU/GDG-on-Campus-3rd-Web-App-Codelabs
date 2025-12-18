// 서비스 워커를 지원하는 브라우저인지 확인
if ('serviceWorker' in navigator) {
  // 페이지 로드가 끝난 뒤 서비스 워커 등록
  window.addEventListener('load', async () => {
    try {
      let reg;

      // 개발 환경(Vite)에서는 ES Module 방식으로 등록
      if (import.meta.env?.DEV) {
        reg = await navigator.serviceWorker.register('/service-worker.js', {
          type: 'module',
        });
      } else {
        // 배포 환경에서는 일반 서비스 워커로 등록
        reg = await navigator.serviceWorker.register('/service-worker.js');
      }

      console.log('Service worker registered! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registration failed: ', err);
    }
  });
}

// DOM이 준비된 후 앱 초기화
window.addEventListener('DOMContentLoaded', async () => {
  // 에디터 모듈 로드 및 초기화
  const { Editor } = await import('./app/editor.js');
  const editor = new Editor(document.body);

  // 메뉴 모듈 로드 및 에디터와 연결
  const { Menu } = await import('./app/menu.js');
  new Menu(document.querySelector('.actions'), editor);

  // 기본 텍스트 설정
  const defaultText = `# Welcome to PWA Edit!\n\nTo leave the editing area, press the \`esc\` key, then \`tab\` or \`shift+tab\`.`;

  editor.setContent(defaultText);
});
