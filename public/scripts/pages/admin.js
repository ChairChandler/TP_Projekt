import { AppForm } from '../others/app-form.js';

class AppModelForm extends AppForm {
    constructor() {
        const form = document.querySelector('#model-form');
        super(form);
        this.registerMetaDeliver(() => this.metaDeliverVoices());
        this.registerMetaDeliver(() => this.metaDeliverSpeaker());

        this.getInputs();
        this.getData();
        this.user.addEventListener('change', ev => this.onChangeUser(ev));
    }

    metaDeliverVoices() {
        const name = this.user.value;

        return {
            activate: true,
            url: `api/users/${name}/voices`,
            method: 'POST',
            body: this.files.files,
            bodyType: 'FILES',
            reload: false,
            redirect: false,
            showSuccessMsg: false
        };
    }

    metaDeliverSpeaker() {
        const name = this.user.value;

        return {
            activate: true,
            url: 'api/speakers',
            method: 'POST',
            body: {
                owner: name
            },
            bodyType: 'JSON',
            reload: true,
            redirect: true,
            showSuccessMsg: true
        };
    }

    getInputs() {
        /**
        * @type {HTMLInputElement}
        */
        this.user = document.querySelector('#user');
        /**
         * @type {HTMLInputElement}
         */
        this.files = document.querySelector('#files');
        // /**
        //  * @type {HTMLSelectElement}
        //  */
        // this.samples = document.querySelector('#samples');
    }

    getData() {
        /**
         * @type {string[]}
         */
         this.usersList = Array.from(document.querySelectorAll('#userList > *'))
         .map(e => e.getAttribute('data-name'));
 
         /**
          * @type {{sid, uid, files}[]}
          */
          this.speakersList = Array.from(document.querySelectorAll('#speakersList > *'))
          .map(s => {
              const sid = s.getAttribute('data-sid');
              const uid = s.getAttribute('data-uid');
 
              const files = Array.from(s.querySelectorAll('*'))
              .map(f => ({id: f.getAttribute('data-id'), fname: f.getAttribute('data-fname')}));
 
              return {sid, uid, files};
          });
    }

    onChangeUser(ev) {
        this.files.value = '';
        // this.samples.value = '';
        this.files.removeAttribute('disabled');
        // this.samples.removeAttribute('disabled');

        if(this.speakersList.length) {
            const username = ev.target.value;
            const speaker = this.speakersList.filter(s => s.uid === username)[0];
            
            for(const file of speaker.files) {
                const option = document.createElement('option');
                option.value = file.id;
                option.text = file.fname;
                // this.samples.appendChild(option);
            }   
        }
    }
}

new AppModelForm();