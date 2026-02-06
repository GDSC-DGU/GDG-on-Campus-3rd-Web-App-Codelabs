# 류동현- JWT 에 치우친 인증 설명

### 

**인코딩(Base64URL)란?**
• **개념:** 바이너리 데이터를 텍스트(64개의 안전한 ASCII 문자)로 변환하는 방식.
• **통신 안전성을 위해 등장:** HTTP 헤더나 URL에 포함될 수 없는 특수문자, 제어문자 등을 안전한 문자로 치환하여 데이터 깨짐을 방지합니다. → 암호화가 아니므로 누구나 디코딩할 수 있다. 보안의 기능이 전혀 x

**인증 방식의 발전 흐름**

**1. HTTP Basic Auth: 가장 원시적인 방식**
• **로직:** `Base64(ID:Password)`를 `Authorization` 헤더에 실어 보냄.
• **문제점:** * **매 요청마다 비밀번호를 전송**하므로 탈취 위험이 매우 높음.
    ◦ 로그아웃 기능이 사실상 없음 (브라우저를 끄기 전까지 메모리에 저장됨).

**2. Session & Cookie: 서버가 나를 기억하다→ 매번 비밀번호를 보내지 않아도 된다!**
• **로직:** 최초 1회 ID/PW로 인증 → 서버 메모리(Session)에 유저 정보 저장 → 클라이언트에 `Session_ID` 발급 → 이후 쿠키에 ID만 담아 통신.
• **단점-서버 확장성 저하:** 서버가 여러 대일 경우 모든 서버가 세션 정보를 공유해야 함 (Redis 등 중앙 저장소 의존성 심화)→ 서버 메모리 부하 발생

**3. JWT (JSON Web Token): 스스로 증명하는 신분증 →매번 비밀번호를 보내지 않아도 된다!, 서버 저장x stateless**
• **로직:** 서버가 상태를 저장하지 않고, 필요한 정보를 토큰 자체에 담아 서명 후 발급.
• **장점:** 서버 부하 감소 및 대규모 트래픽 처리에 최적화.
   어떤 서버에서도 서명만 검증하면 즉시 유저 확인 가능.→ 서버 확장성 측면에서 session보다 효율적

**JWT는 어떻게 만들어질까?**

### 1. 재료 준비 (JSON)

- **Header:** `{"alg":"HS256","typ":"JWT"}`
- **Payload:** `{"userId":"ryu123", "role":"ADMIN"}`
- **SecretKey:** `my-secret-key-2026`

### 2. Base64Url 인코딩

- **Base64(Header):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- **Base64(Payload):** `eyJ1c2VySWQiOiJyeXUxMjMiLCAicm9sZSI6IkFETUlOIn0=`

### 3. 점으로 연결

- **연결된 문자열:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyeXUxMjMiLCAicm9sZSI6IkFETUlOIn0=`

### 4.시크릿 키와 함께 해시(HMAC SHA256) 돌리기

signature=HMACSHA(Base64Url(Header)+’.’+Base64Url(Payload),SecretKey)

- **Signature:** `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

### 5. “.”을 기준으로 이어 붙여 토큰완성

> `eyJhbGci...[Header]`.`eyJ1c2Vy...[Payload]`.`SflKxwRJ...[Signature]`
> 

<img width="1836" height="86" alt="image" src="https://github.com/user-attachments/assets/7bd655cc-fc71-41b3-bdf6-e97e3b0d63d8" />


**JWT방식을 사용한다고 했을 때 생각해 보아야 할 지점 → 로그아웃 처리는 어떻게?**

JWT는 **Stateless를 지향하기 때문에 때문에,** 서버는 토큰을 발급한 뒤 제어권을 상실합니다(저장 x)

→ 사용자가 로그아웃(프론트에서 토큰 삭제)을 해도, **이미 발급된 토큰은 만료 시간까지 여전히 유효**합니다. 악용될 수 있는 위험 존재

• → JWT를 써도 **완벽한 Stateless는 불가능** 보안을 위해서는 결국 서버가 어떤 식으로든 '상태'를 관리해야 한다
****

**JWT를 사용했을 떄 로그아웃 처리 전략**

**Blacklist 방식 (Redis 활용)**
• 로그아웃 요청 시, 해당 토큰을 Redis에 저장하고 '무효화된 토큰'으로 관리.
• 모든 API 요청마다 블랙리스트에 있는지 대조.

**Access & Refresh Token 전략**
• **Access Token:** 수명을 매우 짧게(15~30분) 가져가 탈취 위험 최소화.
• **Refresh Token:** DB/쿠키에 저장하며 Access Token 재발급 시에만 사용.
• **로그아웃 시:** 서버에서 Refresh Token을 삭제→ 재발급 차단

**JWT를 주로 사용하는  OAuth 2.0**
• OAuth는 제3의 서비스(구글, 카카오 등)로부터 **권한을 위임받는 인가(Authorization) 프레임워크**.

정확하게 말하면 인증대행 보다는 인가의 역할을 띄고 있다
