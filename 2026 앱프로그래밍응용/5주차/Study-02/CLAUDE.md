# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인 학습용 디렉토리입니다. 주로 순수 HTML + CSS + Vanilla JS로 작성된 단일 파일 프로젝트를 포함합니다.

## 개발 환경

- 빌드 도구 없음 — 모든 파일은 브라우저에서 직접 열어 실행
- 외부 라이브러리 사용 안 함
- 데이터 저장은 localStorage 사용

## 코드 규칙

- 단일 `.html` 파일로 완성하는 것을 원칙으로 함
- JS는 `<script>` 태그 안에 인라인으로 작성
- 사용자 입력은 반드시 이스케이프 처리 (XSS 방지)
