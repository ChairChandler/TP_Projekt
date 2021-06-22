import './bootstrap-msg.js';

export class AppForm {
    constructor(form) {
        this.requestsQueue = [];
        form.addEventListener('submit', ev => {
            ev.preventDefault();
            for(const f of this.requestsQueue) {
                this.#send(f());
            }
        });
    }

    /**
     * @typedef {{
     * activate, 
     * url, 
     * method, 
     * body, 
     * bodyType, 
     * reload, 
     * redirect,
     * showSuccessMsg}} Meta //'FILES' | 'JSON'
     * @param {() => Meta} deliver 
     */
    registerMetaDeliver(deliver) {
        this.requestsQueue.push(deliver);
    }

    /**
     * 
     * @param {Meta} meta 
     */
    async #send(meta) {
        if(!meta.activate) {
            return;
        }

        let body, headers;
        switch(meta.bodyType) {
            case 'FILES':
                headers = {"Content-Type": 'multipart/form-data'};
                const formData = new FormData();
                for(const name in meta.body) {
                    formData.append(name, meta.body);
                  }
                body = formData;
                break;

            case 'JSON':   
                headers = {"Content-Type": 'application/json'};
                body = JSON.stringify(meta.body);
                break;
        }

        const response = await fetch(meta.url, {
            method: meta.method,
            headers,
            body
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

                if(meta.reload) {
                    setTimeout(() => {
                        window.location.href = window.location.href;
                    }, 3000);
                }
            }            
        }
    }
}