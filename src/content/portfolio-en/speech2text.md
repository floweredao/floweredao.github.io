---
title: "Speech2Text"
tagline: "A macOS menu bar app that types what you say straight into the text field you are using"
summary: "Press a shortcut and speak: the words appear live in whatever field you clicked, whether that is Terminal, a browser, or Notes. It does not interpret commands or rewrite sentences; it types exactly what you said."
audience: "Mac users who want to enter text by voice instead of the keyboard"
platform: "macOS 26 or later · Apple Silicon"
year: "2026"
order: 1
visibility: "public"
stack:
  - "Swift 6"
  - "SwiftUI"
  - "AppKit"
  - "AVFoundation · Core Audio"
  - "macOS Accessibility API"
  - "Keychain (Security framework)"
  - "Soniox real-time speech recognition API"
links:
  - label: "Repository"
    href: "https://github.com/floweredao/Speech2Text"
  - label: "Download the latest release"
    href: "https://github.com/floweredao/Speech2Text/releases/latest"
  - label: "v1.1 release notes"
    href: "https://github.com/floweredao/Speech2Text/releases/tag/v1.1"
cover:
  src: "/images/speech2text/hero.webp"
  alt: "Dictation under the menu bar, typed live into a note"
features:
  - title: "Types into the field you were using"
    body: "Start with the shortcut (Control+Option+D by default) and your words appear in the field you clicked first. When recognition revises earlier words, only the changed tail is erased and retyped."
  - title: "Safe in Terminal too"
    body: "Regular text fields are updated through accessibility text replacement. Places that do not support it, such as Terminal, receive key events sent only to that app. Newlines and Return are never sent, so no command runs by accident."
  - title: "Live transcript under the notch"
    body: "A small window under the notch shows what is being recognized. The final result stays until you close it, and you can copy it or paste it again."
  - title: "Starts without waiting"
    body: "Recording begins the moment the microphone is on, while the Soniox connection completes in the background. A failed connection is retried once, and you are told right away when you are offline."
  - title: "Shortcuts that fit your hands"
    body: "Record key combinations, a single modifier such as the right ⌘ key, or double and triple presses as the shortcut."
gallery:
  - src: "/images/speech2text/notch-idle.webp"
    alt: "The overlay while idle"
    caption: "Idle: a one-line capsule under the notch"
  - src: "/images/speech2text/notch-recording.webp"
    alt: "The overlay while recording"
    caption: "Listening: the transcript updates live as you speak"
  - src: "/images/speech2text/notch-result.webp"
    alt: "The overlay after dictation finished"
    caption: "Done: the result stays until you close it, ready to copy or paste again"
  - src: "/images/speech2text/settings-light.webp"
    alt: "The settings window"
    caption: "Settings: API key, microphone, permissions, input, and shortcut (Korean interface shown)"
---

## What it does

Speech2Text is a dictation app that lives in the Mac menu bar. Press the shortcut and speak, and the text appears live in the field you clicked beforehand. Notes, a browser, or Terminal all work.

It does one thing: dictation. It does not interpret commands or polish your sentences. It focuses on writing down exactly what you said.

It also handles interruptions. If you switch to another app or field mid-dictation, automatic typing stops and the result is kept in the notch window. Copy it from there, or pick the field you want and send it again with Control+Option+V.

## Who it is for

Mac users who sometimes speak faster than they type: leaving a long note, or explaining something in a chat or a terminal without leaving the screen in front of them. It runs on macOS 26 or later on Apple Silicon Macs, and speech recognition needs your own Soniox API key.

## How to use it

1. Download the `.zip` from the [latest release](https://github.com/floweredao/Speech2Text/releases/latest) and move `Speech2Text.app` to the Applications folder.
2. Save your Soniox API key in Settings, then allow microphone and Accessibility access.
3. Click the text field you want to write into.
4. Press Control+Option+D and speak. Press the same shortcut again to settle on the final text and stop. Each recording lasts up to 60 seconds.

## Data and privacy

Audio is sent to Soniox only while recording, and Soniox usage fees apply. Transcripts stay in memory and disappear when you quit the app. Recordings are never saved automatically, and the screen is never captured.

The API key is stored only in a Keychain item dedicated to Speech2Text and is never written to source code or logs. The delete-saved-key button in Settings removes it from this Mac.

## Version history

**1.1** (2026-09-27)

- Added an English interface. The app follows the system language (English or Korean).
- The saved API key can be deleted in Settings, and the microphone list updates as devices connect and disconnect.
- Fixed no sound coming in after switching to a different microphone.
- Errors that can only be fixed in Settings now point you to Settings instead of offering a retry.

**1.0** (2026-09-26)

- First public release.
- Start and stop with a shortcut; text appears in the field live as you speak.
- Record your own shortcut, including modifier-only and multi-press shortcuts.
- See the live transcript in the notch overlay, then copy or paste it.
