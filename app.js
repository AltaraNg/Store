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
        product_sku:'',
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
        access_granted2: false,
        access_granted3: false,
        access_granted4:false,
        idchecked2: false,
        feature: 'lookup',
        feature2: 'purchaselog',
        feature3: 'repaymentlog',
        feature4:'productlog',
        submitted: false,
        submition: false,
        dataloaded: false,
        Customer_id: '',
        CustName: '',
        address: '',
        phoneNo: '',
        Regdate: '',
        repay_date: [],
        repaydata: [],
        orderDate: '',
        firstpurchase: false,
        purchase: {
            p_reciept: '',
            custp_id: '',
            p_date: '',
            product_name: '',
            product_price: '',
            product_sku: '',
            product_qty: '',
            repaymt: ''
        },

        product: {
            psku: '',
            pname: '',
            pdesc: '',
            pprice: '',
            psid: '',
            psdate: '',
            p_cat:''
        }

    },
    watch: {
        product_sku: function() {
            if (this.product_sku.length == 7) {
                console.log("call change");
            }
        }
      },
    mounted: function () {
        console.log('mounted');
        // this.CustomerOrders();
    },
    computed: {
        filteredList_customers: function () {
            return this.list_customers.filter((list_customer) => {
                return list_customer.first_name.match(this.search) + list_customer.last_name.match(this.search);
            });
        },
    },
    methods: {
        Purchase: function () {
            app.purchase.product_sku = app.product_sku;
            app.purchase.repaymt = Math.round((app.purchase.product_price - ((40 / 100) * app.purchase.product_price)) / 12);
            var formData = app.toFormData(app.purchase);
            console.log(app.purchase)
            axios.post("https://altara-api.herokuapp.com/api.php?action=purchase", formData)
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.firstpurchase = true;
                        app.Repay(app.purchase.p_reciept);
                        app.successMessage = response.data.message;
                    }
                });
        },
        getdetailsbySKU(){

        },
        ProductLog: function () {
            console.log(app.product);
            var formData = app.toFormData(app.product);
            axios.post("https://altara-api.herokuapp.com/api.php?action=newproduct", formData)
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                    }
                });
        },
        Repay: function (id) {
            var periodi;
            if (app.firstpurchase == true) {
                console.log('yes');
                periodi = 'firstpayment'
            }
            else {
                periodi = app.repaydata[0].period
            }
            var pushrepay = {
                repayid: id,
                period: periodi
            }
            var formData = app.toFormData(pushrepay);
            axios.post("http://localhost/altaracredit/altara_api/api.php?action=repay", formData)
                .then(function (response) {
                    console.log(response);

                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        setTimeout(function () {
                            app.errorMessage = '';
                        }, 2000);
                    } else {
                        if (app.firstpurchase == false) {
                            app.CustomerOrders();
                        }
                        app.firstpurchase = false;
                        app.successMessage = response.data.message;
                        setTimeout(function () {
                            app.successMessage = '';
                        }, 2000);
                    }
                });
        },
        GainAccess: function (feature) {
            console.log(feature)
            app.submitted = true;
            var emp = app.Employee_id;

            if (!isNaN(emp.charAt(4))) {
                emp.slice(4);
                emp.slice(0, -3)
            }
            else if ((!isNaN(emp.charAt(5)))) {
                emp.slice(5);
                emp.slice(0, -3)
            }
            else {

            }
            var dat = {
                Employee_id: emp,
                Access_code: app.Access_code
            }
            var formData = app.toFormData(dat);
            console.log()
            axios.post("https://altara-api.herokuapp.com/api.php?action=aknowledge", formData)
                .then(function (response) {
                    app.dataloaded = false;
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;

                        setTimeout(function () {
                            app.errorMessage = '';
                        }, 2000);

                    } else {
                        if (response.data.data.length != 0) {
                            if (feature == 'lookup') {
                                if (response.data.data[0].Employee_Role_id == 9 || response.data.data[0].Employee_Role_id == 8 || response.data.data[0].Employee_Role_id == 1 || response.data.data[0].Employee_Role_id == 5 || response.data.data[0].Employee_Role_id == 6) {
                                    app.access_granted = true;
                                    app.successMessage = "Access Granted!, Enter Customer ID below";

                                    setTimeout(function () {
                                        app.successMessage = '';
                                    }, 2000);
                                } else {
                                    app.errorMessage = "Access Denied, Wrong Login Details";

                                    setTimeout(function () {
                                        app.errorMessage = '';
                                    }, 2000);
                                }
                            }

                            if (feature == 'purchaselog') {
                                if (response.data.data[0].Employee_Role_id == 9 || response.data.data[0].Employee_Role_id == 8 || response.data.data[0].Employee_Role_id == 1 || response.data.data[0].Employee_Role_id == 5 || response.data.data[0].Employee_Role_id == 6) {
                                    app.access_granted2 = true;
                                    app.successMessage = "Access Granted!, Enter Customer ID below";

                                    setTimeout(function () {
                                        app.successMessage = '';
                                    }, 2000);
                                } else {
                                    app.errorMessage = "Access Denied, Wrong Login Details";

                                    setTimeout(function () {
                                        app.errorMessage = '';
                                    }, 2000);
                                }
                            }
                            if (feature == 'repaymentlog') {
                                if (response.data.data[0].Employee_Role_id == 9 || response.data.data[0].Employee_Role_id == 8 || response.data.data[0].Employee_Role_id == 1 || response.data.data[0].Employee_Role_id == 5 || response.data.data[0].Employee_Role_id == 6) {
                                    app.access_granted3 = true;
                                    app.successMessage = "Access Granted!, Enter Customer ID below";

                                    setTimeout(function () {
                                        app.successMessage = '';
                                    }, 2000);
                                } else {
                                    app.errorMessage = "Access Denied, Wrong Login Details";

                                    setTimeout(function () {
                                        app.errorMessage = '';
                                    }, 2000);
                                }
                            }

                            if (feature == 'productlog') {
                                if (response.data.data[0].Employee_Role_id == 9 || response.data.data[0].Employee_Role_id == 8 || response.data.data[0].Employee_Role_id == 1 || response.data.data[0].Employee_Role_id == 5 || response.data.data[0].Employee_Role_id == 6) {
                                    app.access_granted4 = true;
                                    app.successMessage = "Access Granted!, Enter Customer ID below";

                                    setTimeout(function () {
                                        app.successMessage = '';
                                    }, 2000);
                                } else {
                                    app.errorMessage = "Access Denied, Wrong Login Details";

                                    setTimeout(function () {
                                        app.errorMessage = '';
                                    }, 2000);
                                }
                            }

                        }

                        else {

                            app.errorMessage = "Access Denied, Wrong Login Details";

                            setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                        }

                    }
                });
        },

        CheckId: function () {
            app.dataloaded = true;
            console.log(app.Customer_id);
            axios.post("https://altara-api.herokuapp.com/api.php?action=checkId", {
                Customer_id: app.Customer_id
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        app.dataloaded = false;
                        setTimeout(function () {
                            app.errorMessage = '';
                        }, 2000);
                    } else {
                        if (response.data.checklist.length != 0) {
                            app.repay = response.data.checklist;
                            console.log(app.repay);
                            app.dataloaded = false;
                            app.CustomerOrders();
                            app.CustName = response.data.checklist[0].first_name + " " + response.data.checklist[0].last_name
                            app.address = response.data.checklist[0].add_houseno + ", " + response.data.checklist[0].add_street + ", " + response.data.checklist[0].area_address + ", Ibadan, Oyo state";
                            app.phoneNo = response.data.checklist[0].telephone;

                            //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
                            var sqlDateArr1 = response.data.checklist[0].Date_of_Registration.split("-");
                            var monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ];
                            var sqlDateArr2 = sqlDateArr1[2].split(" ");
                            var sDay = sqlDateArr2[0];
                            var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
                            var sYear = sqlDateArr1[0];
                            app.Regdate = monthNames[sMonth] + ", " + sDay + ", " + sYear;

                        } else {
                            app.errorMessage = "Customer ID Doest Exist!";
                            // app.sendNotification(name, telnumber)
                            setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                            app.dataloaded = false;
                        }
                        // app.ApproveCustomer(app.CustName, app.phoneNo);
                        // app.Customer_id = "";
                    }
                });
        },

        toFormData: function (obj) {
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }
            return form_data;
        },

        resetMessage: function () {
            app.errorMessage = "";
            app.successMessage = "";
        },

        CustomerOrders: function () {

            axios.post("https://altara-api.herokuapp.com/api.php?action=order", {
                Customer_id: app.Customer_id
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.idchecked = true;
                        if (response.data.orders.length != 0) {
                            app.orderDate = response.data.orders[0].order_date;
                            app.repay_amt = response.data.orders[0].repayment;

                            app.repaydata = [
                                { period: '1st', status: response.data.orders[0].first },
                                { period: '2nd', status: response.data.orders[0].second },
                                { period: '3rd', status: response.data.orders[0].third },
                                { period: '4th', status: response.data.orders[0].fourth },
                                { period: '5th', status: response.data.orders[0].fifth },
                                { period: '6th', status: response.data.orders[0].sixth },
                                { period: '7th', status: response.data.orders[0].seventh },
                                { period: '8th', status: response.data.orders[0].eight },
                                { period: '9th', status: response.data.orders[0].nineth },
                                { period: '10th', status: response.data.orders[0].tenth },
                                { period: '11th', status: response.data.orders[0].eleventh },
                                { period: '12th', status: response.data.orders[0].twelveth }
                            ]

                            console.log(app.orderDate);
                            var date = new Date(app.orderDate);
                            var a = [14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168];
                            for (i = 0; i <= 11; i++) {
                                var ans = app.formatDate(app.addDays(date, a[i]));
                                app.repay_date.push(ans);
                            }
                            console.log(app.repay_date);
                            app.List_orders = response.data.orders;


                            for (i = 0; i < app.repay_date.length; i++) {
                                app.repaydata.forEach(element => {
                                    if (app.repaydata.indexOf(element) == i) {
                                        element.date = app.repay_date[i]
                                    }
                                });
                            }


                            app.repaydata = app.repaydata.filter(function (el) {
                                return el.status == "0";
                            });

                            console.log(app.repaydata);

                        }
                    }
                });
        },

        addDays: function (date, days) {
            var result = new Date(date);
            result.setDate(date.getDate() + days);
            return result;
        },


        formatDate: function (date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        },

        Repayment: function (list) {
            app.repay = list;
            console.log(app.repay);
        },

        checkCust: function () {
            if (app.CheckCusId == '') {
                app.errorMessageChk = "Field can't be empty";
                setTimeout(function () {
                    app.errorMessageChk = '';
                }, 1000);

            } else {
                console.log(app.CheckCusId);
                axios.post("https://wafcolapi.herokuapp.com/api.php?action=checkId", {
                    Customer_id: app.CheckCusId
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.error) {
                            app.errorMessageChk = response.data.message;

                            setTimeout(function () {
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

                                setTimeout(function () {
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
                .then(function (response2) {

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