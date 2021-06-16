/**
 * @type {HTMLButtonElement}
 */
const logout = document.querySelector('#logout');
logout.addEventListener('click', async () => {
    const res = await fetch('api/users/token', {
        method: 'DELETE',
        redirect: 'follow'
    });

    if(!res.ok) {
        const js = await res.json();
        alert(js.message);
    }

    if(res.redirected) {
        window.location.href = res.url;
    }
});