/**
 * @type {HTMLDivElement}
 */
const group = document.querySelector('#mode-selection');
const buttons = Array.from(group.querySelectorAll('button'));

/**
 * @type {any}
 */
const forms = buttons.map(b => {
    const id = b.getAttribute('data-target');
    const f = document.querySelector(id);
    f.style.setProperty('display', 'none');
    return f;
});
buttons.forEach(b => b.addEventListener('click', e => {
    //@ts-ignore
    const id = e.target.getAttribute('data-target');
    for(const f of forms) {
        if(`#${f.getAttribute('id')}` == id) {
            f.style.setProperty('display', 'block');
        } else {
            f.style.setProperty('display', 'none');
        }
    }
}));

document.querySelector('#password-change').addEventListener('change', e => {
    const passwd = document.querySelector('#user-edition-password');
    if(e.target.checked) {
        passwd.removeAttribute('disabled');
    } else {
        passwd.setAttribute('disabled', '');
        passwd.value = '';
    }
})


const users = Array.from(document.querySelectorAll('#usersList > *')).map(n => {
    const name = n.getAttribute('data-name');
    const role = n.getAttribute('data-role');
    return {name, role};
});
   
document.querySelector('#user-edition-username').addEventListener('change', e => {
    const selected = e.target.value;
    const role = users.find(u => u.name == selected).role;
    document.querySelector('#user-edition-role').value = role;
});

document.querySelector('#user-edition-reset').addEventListener('click', () => {
    const passwd = document.querySelector('#user-edition-password');
    passwd.setAttribute('disabled', '');
    passwd.value = '';
});




function createUser() {

}

function editUser() {

}

function removeUser() {

}

document.querySelector('#user-creation').addEventListener('submit', createUser);
document.querySelector('#user-edition').addEventListener('submit', editUser);
document.querySelector('#user-deletion').addEventListener('submit', removeUser);