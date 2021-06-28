const forms = document.querySelectorAll('.forms-collapse > form');
forms.forEach(f => f.classList.add('hidden'));

const links = document.querySelectorAll('.mode-selection a');
links.forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    const id = l.getAttribute('href');
    forms.forEach(f => f.classList.add('hidden'));
    document.querySelector(id).classList.remove('hidden');
}));

document.querySelector('#logout').addEventListener('click', async () => {
    const response = await fetch('api/users/token', {
        method: 'DELETE',
    });
    
    if(!response.ok) {
        const js = await response.json();
        // @ts-ignore
        Msg.error(js.message);
    } else {
        window.location.href = response.redirected ? response.url : window.location.href;
    }
});