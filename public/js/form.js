const form = document.querySelector('.form');
const inputGroups = form.querySelectorAll('.input-group');
const submitBtn = form.querySelector('.js-submit');

let inputBoxs = new Array();
inputGroups.forEach((inputGroup) => {
    let inputBox = {
        label: inputGroup.children[0],
        input: inputGroup.children[1],
        errMsg: inputGroup.children[2]
    }

    inputBoxs.push(inputBox);
});

inputBoxs.forEach((inputBox) => {
    let input = inputBox.input;
    let label = inputBox.label;
    // input 포커스 시 애니메이션 처리
    input.addEventListener('focus', () => {
        input.classList.add('selected');
        label.classList.add('selected');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.classList.remove('selected');
            label.classList.remove('selected');
        }
    });

    input.addEventListener('invalid', (e) => {
        e.preventDefault();
    })
});

submitBtn.addEventListener('click', () => {
    form.classList.add('was-validated');
    inputBoxs.forEach((inputBox) => {
        let input = inputBox.input;
        let errMsg = inputBox.errMsg;

        if (input.validationMessage != "") {
            errMsg.classList.remove('invisible');
        }else {
            if (!errMsg.classList.contains('invisible')) 
                errMsg.classList.add('invisible');
        }
    })
})

/*
const inputs = document.querySelectorAll('.js-input');
const labels = document.querySelectorAll('.js-label');
for (let i=0; i< inputs.length; i++) {
    inputs[i].addEventListener('focus', () => {
        inputs[i].classList.add('selected');
        labels[i].classList.add('selected');
    });

    inputs[i].addEventListener('blur', () => {
        if(!inputs[i].value) {
        inputs[i].classList.remove('selected');
        labels[i].classList.remove('selected');
        }
    });

    inputs[i].addEventListener("invalid", (e) => {
        form.classList.add('was-validated');
        e.preventDefault();
    });
}

button.addEventListener('click', () => {
    console.log(inputs[1].willValidate);
})

*/
