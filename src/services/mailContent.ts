export const signupValidation: (token: string) => string = (token: string) => `
        <div>
            <div>안녕하세요 eedited입니다.</div>
            <div>아래 메일 인증버튼을 눌러 회원가입을 완료해주세요</div>
            <a href='http://127.0.0.1:4000/emailValidation?token=${token}'>인증</a>
        </div>
    `;
