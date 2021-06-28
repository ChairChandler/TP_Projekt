import './bootstrap-msg.js';
const { Subject } = rxjs;

export class AppForm {
    constructor(form) {
        this.completeSubjects = [];
        this.requestsQueue = [];
        form.addEventListener('submit', ev => {
            ev.preventDefault();
            for(const f of this.requestsQueue) {
                this.#send(f());
            }
        });

        this.deliverCounter = 0;
        this.maxDeliverCounter = 0;
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
     * showSuccessMsg,
     * formDataInputName?}} Meta //'FILES' | 'JSON'
     * @param {() => Meta} deliver 
     */
    registerMetaDeliver(deliver) {
        this.maxDeliverCounter++;
        this.requestsQueue.push(deliver);
        const subj = new Subject();
        this.completeSubjects.push(subj);
        return subj.asObservable();
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
                const inputName = meta.formDataInputName ?? 'files';
                const formData = new FormData();
                
                for(const file of meta.body) {
                    formData.append(inputName, file);
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
        
        const js = await this.parseResponseData(response);
        if(!response.ok) {
            // @ts-ignore
            Msg.error(js.message);
            this.completeSubjects[this.deliverCounter].error();
        } else {

            if(response.redirected && meta.redirect) {
                window.location.href = response.url;
                this.completeSubjects[this.deliverCounter].next(js);
            } else if(meta.reload) {

                if(meta.showSuccessMsg) {
                    // @ts-ignore
                    Msg.success(response.statusText, 3000);
                }

                if(meta.reload) {
                    setTimeout(() => {
                        window.location.href = window.location.href;
                        this.completeSubjects[this.deliverCounter].next(js);
                    }, 3000);
                }
            } else {
                this.completeSubjects[this.deliverCounter].next(js);
            }            
        }

        if(++this.deliverCounter == this.maxDeliverCounter) {
            this.deliverCounter = 0;
        }
    }

    async parseResponseData(response) {
        const text = await response.text();
        if(text.length > 0) {
            try {
                return JSON.parse(text);
            } catch(e) {
                return null;
            }
        } else {
            return null;
        }
    }
}