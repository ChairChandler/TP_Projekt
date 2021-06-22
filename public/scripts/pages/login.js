import { AppForm } from '../others/app-form.js';

class AppLoginForm extends AppForm {
    constructor() {
        const form = document.querySelector('#login_window');
        super(form);
        this.getInputs();
        this.registerMetaDeliver(() => this.metaDeliver());
    }

    getInputs() {
        /**
         * @type {HTMLInputElement}
         */
         this.login = document.querySelector('#login');
         /**
          * @type {HTMLInputElement}
          */
         this.password = document.querySelector('#password');
    }

    metaDeliver() {
        return {
            activate: true,
            url: `/api/users/${this.login.value}/token`,
            method: 'POST',
            body: {
                password: this.password.value
            },
            bodyType: 'JSON',
            reload: false,
            redirect: true,
            showSuccessMsg: false
        }
    }
}

new AppLoginForm();