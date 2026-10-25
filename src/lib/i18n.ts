export type Lang = 'ko' | 'en';

/** 한국어판과 영어판이 같이 있는 페이지의 두 주소입니다. */
export interface Alternates {
  ko: string;
  en: string;
}

export const ui = {
  ko: {
    locale: 'ko_KR',
    skip: '본문으로 건너뛰기',
    mainNav: '주 메뉴',
    blog: '블로그',
    portfolio: '포트폴리오',
    switchLabel: 'English',
    public: '공개 저장소',
    private: '비공개 프로젝트',
    audience: '대상',
    platform: '플랫폼',
    year: '연도',
    visibility: '공개 여부',
    privateNote: '소스 코드는 공개하지 않는 프로젝트입니다.',
    features: '주요 기능',
    screens: '화면',
    stack: '사용 기술',
    prevWork: '이전 작업물',
    nextWork: '다음 작업물',
    backToWorks: '포트폴리오 목록으로',
    neighbors: '이웃 항목',
  },
  en: {
    locale: 'en_US',
    skip: 'Skip to content',
    mainNav: 'Main menu',
    blog: 'Blog (Korean)',
    portfolio: 'Portfolio',
    switchLabel: '한국어',
    public: 'Public repository',
    private: 'Private project',
    audience: 'For',
    platform: 'Platform',
    year: 'Year',
    visibility: 'Source',
    privateNote: 'The source code of this project is not public.',
    features: 'Features',
    screens: 'Screens',
    stack: 'Stack',
    prevWork: 'Previous work',
    nextWork: 'Next work',
    backToWorks: 'Back to portfolio',
    neighbors: 'Neighboring works',
  },
} as const;
