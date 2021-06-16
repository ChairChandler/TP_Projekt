/**
 * @type {HTMLFormElement}
 */
const form = document.querySelector('#login_window');
/**
 * @type {HTMLInputElement}
 */
const login = document.querySelector('#login');
/**
 * @type {HTMLInputElement}
 */
const password = document.querySelector('#password');
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    
    const response = await fetch(`api/users/${login.value}/token`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password.value
        })
    });

    if(!response.ok) {
        const js = await response.json();
        alert(js.message);
    }

    if(response.redirected) {
        window.location.href = response.url;
    }
});