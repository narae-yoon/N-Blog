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
}