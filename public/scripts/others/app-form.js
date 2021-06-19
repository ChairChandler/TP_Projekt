import './bootstrap-msg.js';

export class AppForm {
    constructor(form) {
        form.addEventListener('submit', ev => this.#send(ev));
    }

    get activate() {
        return true;
    }

    get url() {
        throw new Error('Unimplemented');
        return null;
    }

    get method() {
        throw new Error('Unimplemented');
        return null;
    }

    get body() {
        throw new Error('Unimplemented');
        return null;
    }

    async #send(ev) {
        ev.preventDefault();
        if(!this.activate) {
            return;
        }

        const body = this.body;
        const headers = {"Accept": "application/json"};
        if(body) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(this.url, {
            method: this.method,
            headers,
            body: JSON.stringify(body)
        });
        
        if(!response.ok) {
            const js = await response.json();
            // @ts-ignore
            Msg.error(js.message);
        } else {
            if(response.redirected) {
                window.location.href = response.url;
            } else {
                // @ts-ignore
                Msg.success(response.statusText, 3000);
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 3000);
            }            
        }
    }
}