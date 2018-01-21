// register the grid component
Vue.component('grid', {
    template: '#grid-template',
    props: {
        data: Array,
        columns: Array
    }
});

const ERRORS = {
    required: 'This field is required.',
    minLength: 'The length should be minimum 8 characters.',
    invalidEmail: 'This is not a valid email address.',
    invalidTel: 'This is not a valid Telephone Number.'
}
var app = new Vue({
    el: '#root',
    data: {
        errorMessage: "",
        successMessage: "",
        search: '',
        errorMessageChk: '',
        successMessageChk: '',
        CheckCusId: "",
        errorMessage: "",
        successMessage: "",
        List_orders: [],
        repay: {},
        Employee_id: '',
        Access_code: '',
        access_granted: false,
        idchecked: false,
        submitted: false,
        submition: false,
        dataloaded: false,
        Customer_id: '',
    },

    mounted: function() {
        console.log('mounted');
        // this.CustomerOrders();
    },

    computed: {
        filteredList_customers: function() {
            return this.list_customers.filter((list_customer) => {
                return list_customer.first_name.match(this.search) + list_customer.last_name.match(this.search);
            });
        },
    },

    methods: {

        GainAccess: function() {
            app.dataloaded = true
            var dat = {
                Employee_id: app.Employee_id,
                Access_code: app.Access_code
            }
            var formData = app.toFormData(dat);
            console.log()
            axios.post("https://altara-api.herokuapp.com/api.php?action=aknowledge", formData)
                .then(function(response) {
                    app.dataloaded = false;
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;

                        setTimeout(function() {
                            app.errorMessage = '';
                        }, 2000);

                    } else {
                        console.log(response.data.data[0].Employee_Role_id)
                        if (response.data.data[0].Employee_Role_id == 10 || response.data.data[0].Employee_Role_id == 8 || response.data.data[0].Employee_Role_id == 7) {
                            app.access_granted = true;
                            app.successMessage = "Access Granted!, Enter Customer ID below";

                            setTimeout(function() {
                                app.successMessage = '';
                            }, 2000);
                        } else {
                            app.errorMessage = "Access Denied, Wrong Login Details";

                            setTimeout(function() {
                                app.errorMessage = '';
                            }, 2000);
                        }
                    }
                });
        },

        CheckId: function() {
            app.dataloaded = true;
            axios.post("https://altara-api.herokuapp.com/api.php?action=checkId", {
                    Customer_id: app.Customer_id
                })
                .then(function(response) {
                    console.log(response);

                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        app.dataloaded = false;
                        setTimeout(function() {
                            app.errorMessage = '';
                        }, 2000);

                    } else {
                        if (response.data.checklist.length != 0) {
                            app.repay = response.data.checklist;
                            console.log(app.repay);
                            app.CustomerOrders();
                            app.dataloaded = false;
                            app.CustName = response.data.checklist[0].first_name + " " + response.data.checklist[0].last_name

                        } else {
                            app.errorMessage = "Customer ID Doest Exist!";
                            // app.sendNotification(name, telnumber)
                            setTimeout(function() {
                                app.errorMessage = '';
                            }, 2000);
                            app.dataloaded = false;
                        }
                        // app.ApproveCustomer(app.CustName, app.phoneNo);
                        // app.Customer_id = "";
                    }
                });
        },

        toFormData: function(obj) {
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }
            return form_data;
        },

        resetMessage: function() {
            app.errorMessage = "";
            app.successMessage = "";
        },


        CustomerOrders: function() {
            axios.post("https://altara-api.herokuapp.com/api.php?action=order", {
                    Customer_id: app.Customer_id
                })
                .then(function(response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.idchecked = true;
                        app.List_orders = response.data.orders;
                    }
                });
        },

        Repayment: function(list) {
            app.repay = list;
            console.log(app.repay);
        },
        checkCust: function() {
            if (app.CheckCusId == '') {
                app.errorMessageChk = "Field can't be empty";
                setTimeout(function() {
                    app.errorMessageChk = '';
                }, 1000);

            } else {

                axios.post("https://wafcolapi.herokuapp.com/api.php?action=checkId", {
                        Customer_id: app.CheckCusId
                    })
                    .then(function(response) {
                        console.log(response);
                        if (response.data.error) {
                            app.errorMessageChk = response.data.message;

                            setTimeout(function() {
                                app.errorMessageChk = '';
                            }, 1000);

                        } else {
                            app.checKiD = response.data.checklist;
                            if (app.checKiD.length != 0) {
                                app.showGuaForm = true;
                                // app.SelectedGuaData = app.checKiD;
                                // console.log(app.SelectedGuaData);

                                app.CustName = response.data.checklist[0].first_name + " " + response.data.checklist[0].last_name
                                    // app.phoneNo = response.data.checklist[0].telephone
                            } else {
                                app.errorMessageChk = "Customer ID doesnt exist!";

                                setTimeout(function() {
                                    app.errorMessageChk = '';
                                }, 1000);
                            }
                            // app.ApproveCustomer(app.CustName, app.phoneNo);
                            // app.Customer_id = "";

                        }
                    });
            }
        },

        sendNotification(name, telnumber) {
            telnumber = telnumber.substr(1);
            let message = "Dear " + name + ", Welcome to Altara Credit Limited. You are required to bring the following documents. 1. Proof of ID, 2. Passport Photo (2), 3. Utility bill(Nepa, Not later than 3 months), 4. Six Months Bank Statement till date,  5. Gurantor's cheque.";
            axios.get("https://api.infobip.com/sms/1/text/query?username=Oluwatoke12&password=Altara99&to=" + 234 + telnumber + "&text=" + message + "")
                .then(function(response2) {

                    console.log(response2);
                    if (response2.status == 200) {
                        updateRemark(Updata)
                    } else {
                        app.errorMessage = "Error Sending Message, Contact Support";
                    }
                });
        }
    }
});