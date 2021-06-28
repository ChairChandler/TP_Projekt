import { AppForm } from '../others/app-form.js';
// import './bootstrap-msg.js';

class AppTestForm extends AppForm {
    constructor() {
        const form = document.querySelector('#test-form');
        super(form);
        
        this.getInputs();
        this.getData();

        if(this.speakersList.length) {
            this.registerAllDelivers();
        } else {
            this.blockInputs();
        }
        
    }

    metaDeliver(sid) {
        return {
            activate: true,
            url: `api/speakers/${sid}`,
            method: 'POST',
            body: this.files.files,
            bodyType: 'FILES',
            formDataInputName: 'file',
            reload: false,
            redirect: false,
            showSuccessMsg: false
        };
    }

    blockInputs() {
        this.files.setAttribute('disabled', 'true');
        document.querySelector('button[type=submit]').setAttribute('disabled', 'true');
        document.querySelector('button[type=reset]').setAttribute('disabled', 'true');
        const alertSpeaker = document.querySelector('#info-no-speaker');
        alertSpeaker.classList.remove('alert-hidden');
        alertSpeaker.classList.add('alert-show');
    }

    registerAllDelivers() {
        let responseData = [];
        for(const speaker of this.speakersList) {
            // copy to prevent reference changing during iteration
            const copy = speaker.sid.valueOf();
            const observable = this.registerMetaDeliver(() => this.metaDeliver(copy));
            observable.subscribe(data => {
                responseData.push({speaker, data});
                if(responseData.length == this.speakersList.length) {
                    this.showMessageWithProbability(responseData);
                    responseData = [];
                }
            });
        }
    }

    showMessageWithProbability(responseData) {
        const maxProbaObject = responseData.filter(v => v.data.probability > 0)[0];
        if(maxProbaObject?.data.probability > 0.5) {
            const user = maxProbaObject.speaker.uid;
            const proba = maxProbaObject.data.probability;
            Msg.success(`Speaker: ${user}\nProbability: ${proba}`, 3000);
        } else {
            Msg.danger('Speaker unrecognised');   
        }
    }

    getInputs() {
        /**
         * @type {HTMLInputElement}
         */
        this.files = document.querySelector('#files');
    }

    getData() {
        /**
        * @type {{sid, uid}[]}
        */
        this.speakersList = Array.from(document.querySelectorAll('#speakersList > *'))
        .map(s => {
            const sid = s.getAttribute('data-sid');
            const uid = s.getAttribute('data-uid');

            return {sid, uid};
        });
    }
}

new AppTestForm();