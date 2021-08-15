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
        <div>
            <h2>Add Asset</h2>
            <input type='text' name='aseetName' placeholder="Name" v-model='assetModel.name' />
            <input type='text' name='aseetAmount' placeholder="Amount" v-model='assetModel.amount' />
            <input type='text' name='aseetCode' placeholder="Code" v-model='assetModel.code' />
            <input type='text' name='aseetCost' placeholder="Cost" v-model='assetModel.cost' />
            <select name="assetType" v-model='assetModel.type'>
                <option v-for='type in assetTypes' :value='type'>{{type}}</option>
            </select>
            <select name="assetSector" v-model='assetModel.sector'>
                <option v-for='sector in sectors' :value='sector'>{{sector}}</option>
            </select>
            <select name="assetAccount" v-model='assetModel.account'>
                <option v-for='account in accounts' :value='account.id'>{{account.name}}</option>
            </select>
            <button v-on:click='addAsset'>Add Asset</button>
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
                assetModel: {
                    name: '',
                    type: 'cash',
                    code: '',
                    amount: '',
                    cost: '',
                    sector: 'none',
                    account: ''
                },
                assetTypes: ['cash', 'stock', 'crypto'],
                sectors: ['none', 'financials', 'utilities', 'consumer discretionary', 'consumer staples', 'energy', 'health', 'industrials', 'technology', 'telecom', 'materials', 'real estate', 'other'],
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
            },
            async addAsset() {
                console.log(this.assetModel);
                let options = {
                    url: 'http://localhost:5001/server-fyre/us-central1/assets',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: { ...this.assetModel }
                }

                try {
                    let { data } = await axios(options);
                    console.log(data);
                    this.getAccounts();
                } catch (error) { console.error(error) }
            }
        }
    }
</script>
