/**
 * ## 필수 기능 테스트

1. 일정 생성

   - 일정 생성 폼 입력
   - 일정 생성 버튼 클릭

2. 일정 수정

   - 일정 수정 아이콘 클릭
   - 일정 수정 폼 입력
   - 일정 수정 버튼 클릭

3. 일정 삭제

   - 일정 삭제 아이콘 클릭

4. 캘린더 뷰

   - 주간 뷰 확인
   - 월간 뷰 확인
   - 공휴일 표시 확인

5. 알림 표시 확인

   - 일정 겹침 => 모달창 표시
   - notification 표시 => 토스트 확인
 */

const getInputByLabel = (labelText) => {
  return cy.contains('label', labelText)
  .invoke('attr', 'for')
  .then(id => cy.get(`[id="${id}"]`))
}

describe('필수 기능 테스트', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  describe.only('일정 생성', () => {
    it('일정 생성 폼 입력', () => {
      getInputByLabel('제목').type('테스트 일정')
      getInputByLabel('날짜').type('2025-02-13')
      getInputByLabel('시작 시간').type('10:00')
      getInputByLabel('종료 시간').type('11:00')
      getInputByLabel('설명').type('테스트 일정 설명')
      cy.get('label').contains('반복 일정').click()
      cy.get('button').contains('일정 추가').click()
    })
  })

  describe('일정 수정', () => {
    it('일정 수정 아이콘 클릭', () => {
      cy.visit('http://localhost:5173')
    })
  })

  describe('일정 삭제', () => {
    it('일정 삭제 아이콘 클릭', () => {
      cy.visit('http://localhost:5173')
    })
  })

  describe('캘린더 뷰', () => {
    it('주간 뷰 확인', () => {
      cy.visit('http://localhost:5173')
    })
  })

  describe('알림 표시 확인', () => {
    it('일정 겹침 => 모달창 표시', () => {
      cy.visit('http://localhost:5173')
    })
  })

  describe('반복 일정 표시 확인', () => {
    it('반복 일정 표시 확인', () => {
      cy.visit('http://localhost:5173')
    })
  })
  
})