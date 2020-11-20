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
const email = inputBoxs[0];

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
                    email.errMsg.style.color = 'var(--main-color)';
                    idCheck = true;
                }else {
                    email.errMsg.innerText = '등록된 이메일입니다.';
                    email.errMsg.style.color = 'var(--point-color)';
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
        let input = inputBox.input;
        let errMsg = inputBox.errMsg;

        if (!input.validity.valid) {
            errMsg.classList.remove('invisible');
            invalidCnt--;
        }else {
            if (!errMsg.classList.contains('invisible')) 
                errMsg.classList.add('invisible');
        }
    })

    if (invalidCnt && idCheck) form.submit();
})
