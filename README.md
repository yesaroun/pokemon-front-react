# pokemon

- Vite
- React
- TailWindCSS
- Firebase


## 구현 기능

### 포켓몬 리스트 페이지
- 포켓몬 API를 활용해서 포켓몬 리스트 보여주기(이미지, 이름, 속성)
- 포켓몬 카드 이미지 보여줄 때 Image Lazy Loading 사용
- 더보기 버튼을 활용해 20개씩 추가
- 간단한 검색 기능 구현
  - 검색 입력 기능은 커스텀 훅을 사용해 debounce 되도록 처리
  - debounce는 keyup 이벤트 처리를 지연시키는데, 이를 통해 서버로 전송되는 api 호출 수를 감소
  - 검색 자동완성 기능 구현
- 스크롤 시 NavBar 색 변경

### 포켓몬 상세 페이지
- 상세 정보 보여주기
- 데이터를 재가공해서 데미지 관계 구현
- 데미지 모달 구현
  - 모달 창 외부 클릭 시 모달 닫게 만드는 Custom Hooks(useOnClickOutside) 구현
- 스프라이트와 설명 api로 get해서 보여주기

### 로그인
- firebase 사용해서 로그인, 로그아웃 구현
- 로그인된 경우 로그인 페이지 접근 불가

