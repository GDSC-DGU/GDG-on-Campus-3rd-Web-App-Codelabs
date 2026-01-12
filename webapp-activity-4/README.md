# 🧩 Web/App Codelab — Activity 4

---

## Workbox로 전환하기(feat. 캐시 톺아보기)

이번 Activity 4에서는 기존 서비스 워커가 있는 웹사이트를 가져와 Workbox를 사용하도록 변환합니다. 
지난 3번째 코드랩에 이어지는 프로그래시브 웹/앱 시리즈입니다!

## 📘 학습 목표

- Workbox를 사용하도록 기존 서비스 워커 변환
- PWA에 오프라인 대체 추가
- 캐싱 방식에 대한 이해

## 🛠 진행 방법

1. 아래 Codelab 링크에 접속하여 실습을 진행합니다.

https://developers.google.com/codelabs/pwa-training/pwa03--working-with-workbox?hl=ko#0

2. 페이지 새로고침 후, Chrome 개발자 도구 → Application → Cache Storage에서 캐시가 정상적으로 저장되어 있는지 확인합니다.

3. 캐싱이 되지 않은 페이지에 접속 시 오프라인 페이지가 제대로 뜨는지 확인합니다.
    - 네트워크를 오프라인 상태로 전환한 뒤,
    - **존재하지 않는 페이지 경로**로 접속했을 때 오프라인 대체 페이지가 정상적으로 표시되면 성공!
  
4. 네트워크 탭을 확인하여 캐시 된 데이터들이 각 캐싱 전략에 맞게 동작하는지 확인합니다.
    - Chrome 개발자 도구의 **Network 탭**에서,
    - 캐시된 데이터들이 각 캐싱 전략에 맞게 불러와지는지 확인합니다.
    - 코드랩에서는 `document`와 `script, style` 리소스가 서로 다른 캐싱 전략을 사용하고 있습니다.
        - 따라서, Cache First와 SWR(Stale-While-Revalidate)의 동작 과정 차이를 이해하고, 실제로 의도한 대로 동작하는지 확인합니다.

5. 각 캐싱 전략(Cache First, SWR)의 동작 흐름을 본인이 이해한 방식으로 정리하여 README 또는 PR 설명에 포함합니다.

6. 위의 내용을 담은 PR을 업로드합니다.

## 🧱 심화 과제 (선택)

- 본 과제에서 다룬 내용을 바탕으로 기술 블로그 글을 작성합니다.
    - 코드랩에서 제시된 Cache First, Stale-While-Revalidate 외에 다른 캐싱 전략(Network First, Cache Only, Network Only 등)을 추가로 적용하여 Workbox 코드를 작성합니다.
    - 각 캐싱 전략을 실제로 실행한 뒤, 개발자 도구(Network, Cache Storage)를 활용하여 요청 흐름을 캡처하고, 캐시 응답과 네트워크 요청이 어떻게 이루어지는지 비교 및 설명합니다.
    
---

## 📤 제출 방법

- **제출 마감:** 2026년 1월 16일(금)
- **제출 방법:** README 참고

---

Happy Coding! 🚀  
GDGoC DGU Web/App 파트
