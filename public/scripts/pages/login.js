import { AppForm } from '../others/app-form.js';

class AppLoginForm extends AppForm {
    constructor() {
        const form = document.querySelector('#login_window');
        super(form);

        /**
         * @type {HTMLInputElement}
         */
        this.login = document.querySelector('#login');
        /**
         * @type {HTMLInputElement}
         */
        this.password = document.querySelector('#password');
    }

    get url() {
        return `/api/users/${this.login.value}/token`;
    }

    get method() {
        return 'POST';
    }

    get body() {
        return {
            password: this.password.value
        };
    }
}

new AppLoginForm();