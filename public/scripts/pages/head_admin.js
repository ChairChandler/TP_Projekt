import { AppForm } from '../others/app-form.js';

class AppUserCreationForm extends AppForm {
    constructor() {
        const form = document.querySelector('#user-creation');
        super(form);

        /**
         * @type {HTMLInputElement}
         */
        this.username = document.querySelector('#user-creation-username');
        /**
         * @type {HTMLSelectElement}
         */
        this.role = document.querySelector('#user-creation-role');
        /**
         * @type {HTMLInputElement}
         */
        this.password = document.querySelector('#user-creation-password');
    }

    get url() {
        return 'api/users';
    }

    get method() {
        return 'POST';
    }

    get body() {
        return {
            name: this.username.value,
            password: this.password.value,
            role: this.role.value
        };
    }
}

class AppUserEditionForm extends AppForm {
    constructor() {
        const form = document.querySelector('#user-edition');
        super(form);

        /**
         * @type {{name, role}[]}
         */
        this.users = Array.from(document.querySelectorAll('#usersList > *')).map(n => {
            const name = n.getAttribute('data-name');
            const role = n.getAttribute('data-role');
            return {name, role};
        });

        /**
         * @type {HTMLSelectElement}
         */
        this.selectedUser = document.querySelector('#user-edition-username');
        this.selectedUser.addEventListener('change', e => this.onChangeUsername(e));

        /**
         * @type {HTMLSelectElement}
         */
        this.selectedRole = document.querySelector('#user-edition-role');
        document.querySelector('#user-edition-reset').addEventListener('click', () => this.onReset());

        /**
         * @type {HTMLInputElement}
         */
        this.newPassword = document.querySelector('#user-edition-password');

        document.querySelector('#password-change').addEventListener('change', e => this.onPasswordChangeCheck(e))
    }

    get url() {
        if(this.passwordCanBeChanged) {
            return `api/users/${this.selectedUser.value}`;
        } else {
            return `api/users/${this.selectedUser.value}/role`;
        }
    }

    get method() {
        return this.passwordCanBeChanged ? 'PUT' : 'PATCH';
    }

    get body() {
        console.log(this.passwordCanBeChanged)
        const role = this.selectedRole.value;
        const password = this.newPassword.value;

        if(this.passwordCanBeChanged) {
            return {role, password};
        } else {
            return {role};
        }
    }

    onChangeUsername(e) {
        const selected = e.target.value;
        const role = this.users.find(u => u.name == selected).role;
        this.selectedRole.value = role;
    }

    onReset() {
        this.newPassword.setAttribute('disabled', '');
        this.newPassword.value = '';
    }

    onPasswordChangeCheck(e) {
        this.passwordCanBeChanged = e.target.value;
        console.log(this.passwordCanBeChanged)
        if(e.target.checked) {
            this.newPassword.removeAttribute('disabled');
        } else {
            this.newPassword.setAttribute('disabled', '');
            this.newPassword.value = '';
        }
    }
}

class AppUserDeletionForm extends AppForm {
    constructor() {
        const form = document.querySelector('#user-deletion');
        super(form);

        /**
        * @type {HTMLSelectElement}
        */
        this.selection = document.querySelector('#user-deletion-username');
    }

    get activate() {
        return !!this.selection.value;
    }

    get url() {
        return `/api/users/${this.selection.value}`;
    }

    get method() {
        return 'DELETE';
    }

    get body() {
        return null;
    }
}

const forms = [
    new AppUserCreationForm(),
    new AppUserEditionForm(),
    new AppUserDeletionForm()
];