const dropdownBtn = document.querySelector('.js-userdrop-btn');
const dropdown = document.querySelector('.js-userdrop');

dropdownBtn.addEventListener('click', () => {
    if (dropdown.classList.contains('visible'))
    dropdown.classList.remove('visible');
    else dropdown.classList.add('visible');
});
