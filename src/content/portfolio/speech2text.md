---
title: "Speech2Text"
tagline: "말한 내용을 지금 쓰고 있는 입력 칸에 바로 받아쓰는 macOS 메뉴바 앱"
summary: "단축키를 누르고 말하면 터미널, 브라우저, 메모처럼 클릭해 둔 입력 칸에 실시간으로 글자가 써집니다. 명령을 해석하거나 문장을 고쳐 쓰지 않고, 말한 그대로 받아씁니다."
audience: "키보드 대신 말로 빠르게 글을 넣고 싶은 Mac 사용자"
platform: "macOS 26 이상 · Apple Silicon"
year: "2026"
order: 1
visibility: "public"
stack:
  - "Swift 6"
  - "SwiftUI"
  - "AppKit"
  - "AVFoundation · Core Audio"
  - "macOS 접근성 API"
  - "Keychain (Security 프레임워크)"
  - "Soniox 실시간 음성 인식 API"
links:
  - label: "저장소"
    href: "https://github.com/floweredao/Speech2Text"
  - label: "최신 릴리스 내려받기"
    href: "https://github.com/floweredao/Speech2Text/releases/latest"
  - label: "v1.1 릴리스 노트"
    href: "https://github.com/floweredao/Speech2Text/releases/tag/v1.1"
cover:
  src: "/images/speech2text/hero.webp"
  alt: "메뉴 막대 아래에서 받아쓰는 동안 메모에 실시간으로 입력되는 모습"
features:
  - title: "지금 쓰던 칸에 바로 입력"
    body: "단축키(기본값 Control+Option+D)로 시작하면 먼저 클릭해 둔 입력 칸에 말하는 대로 써집니다. 인식이 앞말을 고치면 바뀐 끝부분만 지우고 다시 씁니다."
  - title: "터미널에서도 안전하게"
    body: "일반 입력 칸은 접근성 텍스트 교체로, 터미널처럼 교체를 지원하지 않는 곳은 그 앱에만 보내는 키 입력으로 씁니다. 줄바꿈이나 Return은 보내지 않아 명령이 실행되지 않습니다."
  - title: "노치 아래 실시간 전사"
    body: "노치 아래 작은 창에 인식 중인 내용이 보입니다. 끝난 결과는 닫을 때까지 남고, 복사나 붙여넣기로 되살릴 수 있습니다."
  - title: "기다리지 않는 시작"
    body: "마이크가 켜지는 즉시 녹음을 시작하고 Soniox 연결은 뒤에서 이어집니다. 연결이 한 번 실패하면 한 번 더 시도하고, 인터넷이 끊겨 있으면 바로 알려 줍니다."
  - title: "내 손에 맞춘 단축키"
    body: "키 조합은 물론, 오른쪽 ⌘ 하나처럼 수정 키만 누르는 방식과 두 번, 세 번 누르기도 단축키로 기록할 수 있습니다."
gallery:
  - src: "/images/speech2text/notch-idle.webp"
    alt: "대기 중인 오버레이"
    caption: "대기: 노치 아래 한 줄 캡슐"
  - src: "/images/speech2text/notch-recording.webp"
    alt: "녹음 중인 오버레이"
    caption: "듣는 중: 말하는 동안 전사가 실시간으로 바뀝니다"
  - src: "/images/speech2text/notch-result.webp"
    alt: "받아쓰기를 마친 오버레이"
    caption: "완료: 닫을 때까지 결과가 남고, 복사와 붙여넣기로 되살릴 수 있습니다"
  - src: "/images/speech2text/settings-light.webp"
    alt: "설정 창"
    caption: "설정: API 키, 마이크, 권한, 입력, 단축키"
---

## 무엇을 하는 프로그램인가

Speech2Text는 Mac 메뉴바에 사는 받아쓰기 앱입니다. 단축키를 누르고 말하면, 미리 클릭해 둔 입력 칸에 글자가 실시간으로 써집니다. 메모든 브라우저든 터미널이든 상관없습니다.

하는 일은 딱 하나, 받아쓰기입니다. 명령을 해석하지도, 문장을 다듬어 다시 쓰지도 않습니다. 말한 그대로 옮기는 데만 집중했습니다.

입력이 끊기는 경우도 생각했습니다. 받아쓰는 도중 다른 앱이나 칸으로 옮기면 자동 입력을 멈추고 결과를 노치 창에 보관합니다. 거기서 복사하거나, 원하는 칸을 고른 뒤 Control+Option+V로 다시 보내면 됩니다.

## 누구를 위한 것인가

키보드보다 말이 빠른 순간이 있는 Mac 사용자를 위한 앱입니다. 긴 메모를 남길 때, 채팅이나 터미널에 설명을 적을 때처럼 지금 보고 있는 화면을 떠나지 않고 말로 글을 넣고 싶을 때 씁니다. macOS 26 이상, Apple Silicon Mac에서 돌아가고, 음성 인식에는 본인의 Soniox API 키가 필요합니다.

## 어떻게 쓰나

1. [최신 릴리스](https://github.com/floweredao/Speech2Text/releases/latest)에서 `.zip`을 내려받아 `Speech2Text.app`을 응용 프로그램 폴더로 옮깁니다.
2. 설정에서 Soniox API 키를 저장하고, 마이크와 손쉬운 사용 권한을 허용합니다.
3. 글을 넣을 입력 칸을 먼저 클릭합니다.
4. Control+Option+D를 누르고 말합니다. 같은 단축키를 다시 누르면 확정된 문장으로 맞추고 끝납니다. 한 번에 최대 60초까지 녹음합니다.

## 데이터와 개인정보

오디오는 녹음하는 동안에만 Soniox로 전송되고, Soniox 사용 요금이 적용됩니다. 전사 결과는 메모리에만 남아 앱을 끄면 사라집니다. 녹음 파일을 자동으로 저장하거나 화면을 수집하지 않습니다.

API 키는 Speech2Text 전용 Keychain 항목에만 보관하고, 소스나 로그에는 기록하지 않습니다. 설정의 저장된 키 삭제 버튼으로 이 Mac에서 지울 수 있습니다.

## 버전 기록

**1.1** (2026-09-27)

- 영어 인터페이스를 추가했습니다. 시스템 언어(영어 또는 한국어)를 따릅니다.
- 설정에서 저장된 API 키를 삭제할 수 있고, 마이크 목록이 장치 연결과 해제에 맞춰 바로 갱신됩니다.
- 다른 마이크로 바꾸면 소리가 들어오지 않던 문제를 고쳤습니다.
- 설정을 바꿔야만 해결되는 오류에는 다시 시도 대신 설정 확인을 안내합니다.

**1.0** (2026-09-26)

- 첫 공개 릴리스입니다.
- 단축키로 시작하고 끝내며, 말하는 동안 입력 칸에 실시간으로 써집니다.
- 수정 키만 누르기와 여러 번 누르기를 포함해 단축키를 직접 기록할 수 있습니다.
- 노치 오버레이에서 실시간 전사를 보고, 복사하거나 붙여넣을 수 있습니다.
