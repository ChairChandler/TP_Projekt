import { AppForm } from '../others/app-form.js';

class AppUserCreationForm extends AppForm {
    constructor() {
        const form = document.querySelector('#user-creation');
        super(form);
        this.getInputs();
        this.registerMetaDeliver(() => this.metaDeliver());
    }

    getInputs() {
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

    metaDeliver() {
        return {
            activate: true,
            url: 'api/users',
            method: 'POST',
            body: {
                name: this.username.value,
                password: this.password.value,
                role: this.role.value
            },
            bodyType: 'JSON',
            reload: true,
            redirect: false,
            showSuccessMsg: true
        }
    }
}

class AppUserEditionForm extends AppForm {
    constructor() {
        const form = document.querySelector('#user-edition');
        super(form);
        this.registerMetaDeliver(() => this.metaDeliver());

        /**
         * @type {{name, role}[]}
         */
        this.users = Array.from(document.querySelectorAll('#usersList > *')).map(n => {
            const name = n.getAttribute('data-name');
            const role = n.getAttribute('data-role');
            return {name, role};
        });

        this.getInputs();

        this.selectedUser.addEventListener('change', e => this.onChangeUsername(e));
        document.querySelector('#user-edition-reset').addEventListener('click', () => this.onReset());
        document.querySelector('#password-change').addEventListener('change', e => this.onPasswordChangeCheck(e))
    }

    getInputs() {
        /**
         * @type {HTMLSelectElement}
         */
        this.selectedUser = document.querySelector('#user-edition-username');
        
        /**
         * @type {HTMLSelectElement}
         */
        this.selectedRole = document.querySelector('#user-edition-role');
        
        /**
         * @type {HTMLInputElement}
         */
        this.newPassword = document.querySelector('#user-edition-password');
    }

    metaDeliver() {
        let url;
        if(this.passwordCanBeChanged) {
            url = `api/users/${this.selectedUser.value}`;
        } else {
            url = `api/users/${this.selectedUser.value}/role`;
        }

        const method = this.passwordCanBeChanged ? 'PUT' : 'PATCH';;

        const role = this.selectedRole.value;
        const password = this.newPassword.value;

        let body;
        if(this.passwordCanBeChanged) {
            body = {role, password};
        } else {
            body = {role};
        }

        return {
            activate: true,
            url,
            method,
            body,
            bodyType: 'JSON',
            reload: true,
            redirect: false,
            showSuccessMsg: true
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
        this.registerMetaDeliver(() => this.metaDeliver());
        this.getInputs();
    }

    getInputs() {
        /**
        * @type {HTMLSelectElement}
        */
         this.selection = document.querySelector('#user-deletion-username');
    }

    metaDeliver() {
        return {
            activate: !!this.selection.value,
            url: `/api/users/${this.selection.value}`,
            method: 'DELETE',
            body: null,
            bodyType: null,
            reload: true,
            redirect: false,
            showSuccessMsg: true
        }
    }
}

const forms = [
    new AppUserCreationForm(),
    new AppUserEditionForm(),
    new AppUserDeletionForm()
];