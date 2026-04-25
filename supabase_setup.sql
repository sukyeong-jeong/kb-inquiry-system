-- KB금융 고객 문의 자동 분류 시스템 DB 스키마
-- SQL Editor에서 아래 내용을 복사하여 실행하세요.

-- 1. 기존 테이블 삭제 (초기화용)
DROP TABLE IF EXISTS inquiries CASCADE;

-- 2. 테이블 생성
CREATE TABLE inquiries (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT now(),
    customer_name text NOT NULL,
    inquiry text NOT NULL,
    category text NOT NULL,
    urgency text NOT NULL,
    summary text NOT NULL,
    department text NOT NULL,
    script text NOT NULL
);

-- 3. 보안 정책 비활성화 (실습용)
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;

-- 4. 샘플 데이터 (선택 사항)
-- INSERT INTO inquiries (customer_name, inquiry, category, urgency, summary, department, script)
-- VALUES ('홍길동', '카드 분실했습니다. 어떻게 하나요?', '카드', '높음', '카드 분실 및 대처 방법 문의', '카드관리팀', '고객님, 카드 분실로 많이 당황하셨을 텐데 즉시 정지 및 재발급 도와드리겠습니다.');

-- 안내: 성공적으로 실행되면 'Success' 메시지가 표시됩니다.
