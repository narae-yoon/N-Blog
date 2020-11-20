const form = document.querySelector('.form');
const inputGroups = form.querySelectorAll('.input-group');
const submitBtn = form.querySelector('.js-submit');
const idCheckBtn = form.querySelector('.js-id-check');
let idCheck = false;
let inputBoxs = new Array();
inputGroups.forEach((inputGroup) => {
    let inputBox = {
        label: inputGroup.children[0],
        input: inputGroup.children[1],
        errMsg: inputGroup.children[2]
    }

    inputBoxs.push(inputBox);
});

inputBoxs.push({
    label: form.querySelector('.js-gender-label'),
    input: form.querySelector('.js-gender'),
    errMsg: form.querySelector('.js-gender-err')
});
const email = inputBoxs[0];
const passwd = inputBoxs[1];
const pwCheck = inputBoxs[2];

function valid(inputBox) {
    inputBox.input.classList.add('valid');
    inputBox.input.classList.remove('invalid');
    inputBox.errMsg.classList.add('invisible');
    inputBox.errMsg.classList.add('positive');
}

function invalid(inputBox) {
    inputBox.input.classList.remove('valid');
    inputBox.input.classList.add('invalid');
    inputBox.errMsg.classList.remove('invisible');
    inputBox.errMsg.classList.remove('positive');
}

inputBoxs.forEach((inputBox) => {
    let input = inputBox.input;
    let label = inputBox.label;
    
    input.addEventListener('focus', () => {
        // input 포커스 시 애니메이션 처리
        input.classList.add('selected');
        label.classList.add('selected');
    });

    input.addEventListener('blur', () => {
        // input 포커스 잃을 시 애니메이션 처리
        if (!input.value) {
            input.classList.remove('selected');
            label.classList.remove('selected');
        }
    });

    input.addEventListener('invalid', (e) => {
        // 기본 유효성 검증 무시
        e.preventDefault();
    })
});

email.input.addEventListener('input', () => {
    if (email.input.validity.valid) {
        idCheckBtn.disabled = false;
    }else {
        idCheckBtn.disabled = true;
    }
})

idCheckBtn.addEventListener('click', () => {
    // email 중복 체크
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (xhr.response === 'true') {
                    email.errMsg.innerText = '사용 가능한 이메일입니다.';
                    email.errMsg.classList.add('positive');

                    email.input.classList.add('valid');
                    email.input.classList.remove('invalid');
                    idCheck = true;
                }else {
                    email.errMsg.innerText = '등록된 이메일입니다.';
                    email.errMsg.classList.remove('positive');
                    
                    email.input.classList.remove('valid');
                    email.input.classList.add('invalid');
                    idCheck = false;
                }
                email.errMsg.classList.remove('invisible');
            }
        }
    }
    xhr.open('POST', '/users/signUp/idCheck', true);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send('email='+email.input.value);
});

submitBtn.addEventListener('click', () => {
    // 유효성 검증
    let invalidCnt = 1;

    form.classList.add('was-validated');
    inputBoxs.forEach((inputBox) => {
        if (!inputBox.input.validity.valid) {
            invalid(inputBox);
            invalidCnt--;
        }else {
            valid(inputBox);
        }
    })

    // 아이디 중복 체크 여부
    if (!idCheck) {
        email.errMsg.innerText = '아이디 중복체크를 완료해주세요.';
        invalid(email);
    }

    // 비밀번호 확인
    if (passwd.input.value === pwCheck.input.value) {
        valid(pwCheck);
    }else {
        invalid(pwCheck);
        pwCheck.errMsg.innerText = '비밀번호가 서로 다릅니다.';
        pwCheck.errMsg.classList.remove('invisible');
    }


    if (invalidCnt && idCheck) form.submit();
})
