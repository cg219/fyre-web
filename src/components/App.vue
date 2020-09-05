<template>
    <div>
        <h1>Fyre</h1>
        <div>
            <h2>Create Account</h2>
            <input type='text' name='accountName' v-model='newAccount.name' />
            <select name="accountType" v-model='newAccount.type'>
                <option v-for='type in accountTypes' :value='type'>{{type}}</option>
            </select>
            <button v-on:click='addAccount'>Add Account</button>
        </div>
        <div>
            <h2>Edit Account</h2>
            <input type='text' name='accountName' v-model='editAccount.name' />
            <select name="accountType" v-model='editAccount.type'>
                <option v-for='type in accountTypes' :value='type'>{{type}}</option>
            </select>
            <button v-on:click='updateAccount'>Update Account</button>
        </div>
        <ul>
            <li v-for='account in accounts' :data-id='account.id'>
                <span v-on:click='setEditAccount(account)'>{{account.name}}</span>
                <button v-on:click='deleteAccount(account.id)'>&times;</button>
            </li>
        </ul>
    </div>
</template>

<script>
    const axios = require('axios');

    module.exports = {
        data: () => {
            return {
                message: 'Fyre',
                accounts: [],
                newAccount: {
                    name: '',
                    type: 'savings'
                },
                editAccount: {
                    name: '',
                    type: 'savings',
                    id: ''
                },
                accountTypes: ['savings', 'checkings', 'retirement', 'brokerage', 'digital', 'lender', 'property']
            }
        },
        async created() {
            this.getAccounts()
        },
        methods: {
            async addAccount() {
                let options = {
                    url: 'http://localhost:5001/server-fyre/us-central1/accounts',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        name: this.newAccount.name,
                        type: this.newAccount.type
                    }
                }

                try {
                    let { data } = await axios(options);

                    this.accounts.push(data.data);
                    this.newAccount = { name: '', type: 'savings' };
                } catch (error) { console.error(error) }
            },
            async getAccounts() {
                let options = {
                    method: 'GET',
                    url: 'http://localhost:5001/server-fyre/us-central1/accounts'
                }
                let { data } = await axios(options);

                this.accounts = data.data;
            },
            setEditAccount(account) {
                this.editAccount.name = account.name;
                this.editAccount.type = account.type;
                this.editAccount.id = account.id;
            },
            async updateAccount() {
                let options = {
                    url: 'http://localhost:5001/server-fyre/us-central1/accounts',
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        name: this.editAccount.name,
                        type: this.editAccount.type,
                        id: this.editAccount.id
                    }
                }

                try {
                    let { data } = await axios(options);

                    this.editAccount = { name: '', type: 'savings', id: '' };
                    this.getAccounts();
                } catch (error) { console.error(error) }
            },
            async deleteAccount(id) {
                let options = {
                    url: 'http://localhost:5001/server-fyre/us-central1/accounts',
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    data: { id }
                }

                try {
                    let { data } = await axios(options);

                    this.getAccounts();
                } catch (error) { console.error(error) }
            }
        }
    }
</script>
