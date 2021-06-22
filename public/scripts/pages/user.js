import { AppForm } from '../others/app-form.js';

class AppTestForm extends AppForm {
    constructor() {
        const form = document.querySelector('#test-form');
        super(form);
        this.registerMetaDeliver(() => this.metaDeliver());

        this.getInputs();
        this.getData();
    }

    metaDeliver() {
        const name = this.user.value;
        const sid = this.speakersList.filter(s => s.uid === name)[0].sid;

        return {
            activate: true,
            url: `api/speakers/${sid}`,
            method: 'POST',
            body: this.files.files,
            bodyType: 'FILES',
            reload: false,
            redirect: false,
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