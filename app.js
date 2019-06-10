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
        referrer_id: '',
        staff_referrer_id: '',
        product_sku: '',
        ppercentage: '',
        product_price: '',
        twproduct_price: '',
        frproduct_price: '',
        first_payment: '',
        product_name: '',
        repayment: '',
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
        access_granted4: false,
        idchecked2: false,
        feature: 'lookup',
        feature2: 'purchaselog',
        feature3: 'repaymentlog',
        feature4: 'productlog',
        submitted: false,
        submition: false,
        dataloaded: false,
        Customer_id: '',
        CustName: '',
        address: '',
        phoneNo: '',
        Regdate: '',
        empStatus:'',
        status:'',
        repay_date: [],
        repaydata: [],
        selected_order: [],
        list_employees: [],
        Sale_Category: [ { id:1, name: "normal -0%", percent:0},
        {id:2, name: "sala-promo -0%", percent:0},
        {id:3, name: "group5 -5%", percent:5},
        {id:4, name: "group10 -10%", percent:10},
        {id:5, name: "xmas-promo -0%", percent:0},
        {id:6, name: "renewal -5%", percent:5},
        {id:7, name: "family-friend -5%", percent:5}
        ],

        sales_t: [ { id:1, name: "6 month plan 0%", percent:0},
        {id:2, name: "6 month plan 20%", percent:20},
        {id:3, name: "6 month plan 40%", percent:40},
        {id:4, name: "6 month plan 60%", percent:60},
        {id:5, name: "6 month plan 80%", percent:80},
        ],

        orderList: [],
        orderDate: '',
        firstpurchase: false,
        purchase: {
            p_reciept: '',
            p_date: '',
            cate_gory:'',
            custp_id: '',
            product_sku: '',
            product_price: '',
            down_pay:'',
            sales_agent: '',
            product_name: '',
            product_gty:1,
            sale_type: '',
            discount:'',
            repaymt: '',
            pay_mtd:'',
            dep_to:'',
            return:'',
            referrer_id: '',
        },
        
        cust_type:'',
        sale_type: '',
        check_ut: '',
        check_id: '',
        check_bs: '',
        check_pp: '',
        check_gc: '',
        w_guar: '',
        p_guar: '',
        store_v: '',
        product: {
            psku: '',
            pname: '',
            pdesc: '',
            psid: '',
            psdate: '',
            p_cat: '',
            // tpc_pprice: '',
            p_price: '',
            receiver_id: '',
            store_name: ''
        },
        Branchname: [
            "Challenge",
            "Dugbe",
            "Iwo-Road",
            "Bodija",
            "Agodi-Gate",
            "Life-Style Bodija",
            "Apata",
            "Life-Style Iwo-Road"
        ],
        Bank: [
            "Access Bank",
            "Diamond Bank",
            "Ecobank Nigeria",
            "Fidelity Bank Nigeria",
            "First Bank of Nigeria",
            "First City Monument Bank",
            "Guaranty Trust Bank",
            "Heritage Bank Plc.",
            "Keystone Bank Limited",
            "Mainstreet Bank Limited",
            "Skye Bank",
            "Stanbic IBTC Bank Nigeria Limited",
            "Sterling Bank",
            "Union Bank of Nigeria",
            "United Bank for Africa",
            "Unity Bank Plc.",
            "Wema Bank",
            "Zenith Bank"
        ],

        payDate: '',
        amtPay: '',
        cat_label: '',
        pdiscount:'',
        count:'',
        sale_t:'',
        pay_mtd:'',
        pay_bank:'',
        computed_discount:'',
        discount_t:'',
    },
    watch: {
        product_sku: function () {
            console.log(this.product_sku.toUpperCase());
            if (this.product_sku.length > 5) {
                console.log("call change");
                axios.post("https://altara-api.herokuapp.com/api.php?action=checkprod", { product_sku: this.product_sku })
                    // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=checkprod", { product_sku: this.product_sku })
                    .then(function (response) {
                        app.dataloaded = false;
                        console.log(response);
                        if (response.data.error) {
                            app.errorMessage = response.data.message;
                        } else {
                          
                            app.Customer_id = app.purchase.custp_id;
                            app.PurchaseidCheck();
                            app.checkEmpStatus(app.Customer_id);

                            app.sales_t.forEach(function(obj){
                                if (obj.id == app.purchase.sale_type){
                                         app.sale_t = obj.percent;
                                }
                            })
                            app.Sale_Category.forEach(function(obj){
                                if (obj.id == app.purchase.discount){
                                         app.discount_t = obj.percent;
                                }
                            })

                            if (response.data.users.length > 0) {        
                                app.priceCal(response.data.users[0].pc_pprice,app.sale_t,app.cust_type)
                                if (app.discount_t != 0){
                                    app.computed_discount = app.purchase.product_price*(app.discount_t/100)
                                }
                                else app.computed_discount = 0
                                app.CountOrders();
                                console.log(app.computed_discount);
                               
                            }
                            else
                            
                                app.errorMessage = 'No records'; setTimeout(function () {
                                    app.errorMessage = '';
                                }, 2000);


                            if (response.data.users[0].product_name) {
                                app.product_name = response.data.users[0].product_name;
                            }
                            else
                            app.errorMessage = 'No records'; setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                        }
                    });
            } else {
                app.product_name = '';
                app.purchase.product_price='';
                app.purchase.down_pay='';
                app.purchase.repaymt='';
                app.computed_discount='';
            }
        },

        ppercentage: function () {
            if (this.product_sku.length != '' && this.ppercentage == 'twenty') {
                app.product_price = app.twproduct_price;
                console.log("twenty" + app.product_price);
                app.repayment = Math.floor(((app.product_price - ((Math.floor((0.2 * app.product_price) / 100)) * 100)) / 12) / 100) * 100;
                app.first_payment = (Math.floor((0.2 * app.product_price) / 100)) * 100
            }
            else {
                app.product_price = app.frproduct_price;
                console.log("fourty" + app.product_price);
                app.repayment = Math.floor(((app.product_price - ((Math.floor((0.4 * app.product_price) / 100)) * 100)) / 12) / 100) * 100;
                app.first_payment = (Math.floor((0.4 * app.product_price) / 100)) * 100
            }
        },
        customer:function(){
        }
    },
    mounted: function () {
        console.log('mounted');
        this.ListEmployees();
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
            // var percent;
            app.purchase.product_sku = app.product_sku.toUpperCase();
            app.purchase.product_name = app.product_name;
            app.purchase.product_gty = 1;
            var formData = app.toFormData(app.purchase);
        console.log(app.purchase);
           if (
            // app.purchase.dep_to != '' &&
            // app.purchase.discount != '' &&
            app.purchase.p_reciept != '' &&
            app.purchase.pay_mtd != '' &&
            // app.purchase.referrer_id != '' &&
            // app.purchase.return != '' &&
            app.purchase.sale_type != '' 
             )
            {
             axios.post("https://altara-api.herokuapp.com/api.php?action=purchase", formData)
                        // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=purchase", formData)
                        .then(function (response) {
                            console.log(response);
                            if ( typeof response.data !== 'object') {
                                app.errorMessage = "Record already Exist"; setTimeout(function () {
                                    app.errorMessage = '';
                                }, 2000);

                            } else {
                                app.firstpurchase = true;
                                app.Repay(app.purchase.p_reciept, app.purchase.p_date);
                                app.updateStore(app.purchase.product_sku, app.purchase.p_date, app.purchase.sales_agent);
                                app.successMessage = response.data.message;

                                console.log('Ok')
                                app.purchase.p_reciept = '';
                                app.purchase.p_date = '' ;
                                app.purchase.cate_gory = '' ;
                                app.purchase.custp_id = '' ;
                                app.purchase.product_sku = '';
                                app.purchase.product_price = '';
                                app.purchase.down_pay = '' ;
                                app.purchase.sales_agent = '' ;
                                app.purchase.product_name = '' ;
                                app.purchase.product_gty = '' ;
                                app.purchase.sale_type = '' ;
                                app.purchase.discount = '' ;
                                app.purchase.repaymt = '' ;
                                app.purchase.pay_mtd = '' ;
                                app.purchase.dep_to = '' ;
                                app.purchase.referrer_id='';
                                app.product_name='';
                                app.product_sku='';
                            }
                        });    
                    }        
            else {
                app.errorMessage = 'All field must be filled'; setTimeout(function () {
                    app.errorMessage = '';
                }, 2000);
            }
        },

        ListEmployees: function () {
            axios.get("https://altara-api.herokuapp.com/api.php?action=listsalesemp")
                // axios.get("http://localhost/AltaraCredit/altara_api/api.php?action=listsalesemp")
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.list_employees = response.data.users;
                        console.log(app.list_employees);
                    }
                });
        },

        CountOrders: function () {
            axios.post("https://altara-api.herokuapp.com/api.php?action=orderCount", {
            // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=orderCount",{
                Customer_id: app.purchase.custp_id
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.count = response.data.checklist[0].count;
                            app.purchase.cate_gory = (app.count == 0)? 1 : 2 
                        console.log(app.count);
                    }
                });
        },

        checkEmpStatus: function (id) {
            axios.post("https://altara-api.herokuapp.com/api.php?action=emptSta", {
            // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=empSta",{
                Customer_id: id
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.empStatus = response.data.checklist[0].empstatus;
                        console.log(app.empStatus);
                    }
                });
        },

        ProductLog: function () {

            if (app.product.psku != '' &&
                app.product.pname != '' &&
                app.product.pdesc != '' &&
                app.product.psid != '' &&
                app.product.psdate != '' &&
                app.product.p_cat != '' &&
                // app.product.tpc_pprice != '' &&
                app.product.p_price != '' &&
                app.product.receiver_id != '' &&
                app.product.store_name != '') {

                app.product.psku = app.product.psku.toUpperCase();
                app.product.pname = app.product.pname.toUpperCase();
                console.log(app.product);
                var formData = app.toFormData(app.product);
                axios.post("https://altara-api.herokuapp.com/api.php?action=newproduct", formData)
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=newproduct", formData)
                    .then(function (response) {
                        console.log(response); 
                        if ( typeof response.data !== 'object') {
                            app.errorMessage = "Record already Exist"; setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                         } else {
                            app.successMessage = response.data.message;

                            app.product.psku = '';
                            app.product.pname = '';
                            app.product.pdesc = '';
                            app.product.psid = '';
                            app.product.psdate = '';
                            app.product.p_cat = '';
                            // app.product.tpc_pprice = '';
                            app.product.p_price = '';
                            app.product.receiver_id = '';
                            app.product.store_name = '';

                        }
                    });

            }
            else app.errorMessage = 'All field must be filled';
        },

        Repay: function (id, paydate) {
            var api_link;
            var nextdate;
            var date = new Date(paydate);
            var periodi;
            var pay_mtd
            var pay_bank
            if (app.firstpurchase == true) {
                periodi = 'firstpayment';
                pay_mtd = app.purchase.pay_mtd
                pay_bank = app.purchase.dep_to

            } else {
                periodi = app.repaydata[0].period
                pay_mtd = app.pay_mtd
                pay_bank = app.pay_bank
            }
                
            if (app.empStatus == 'Salaried' || app.empStatus == 'formal'){
                nextdate = app.formatDate(app.addDays(date, 28));
                api_link =  "https://altara-api.herokuapp.com/api.php?action=formal_repay"
                // api_link =  "http://localhost/AltaraCredit/altara_api/api.php?action=formal_repay"

             }
             else {
                nextdate =app.formatDate(app.addDays(date, 14));
                api_link =  "https://altara-api.herokuapp.com/api.php?action=informal_repay"
                // api_link =  "http://localhost/AltaraCredit/altara_api/api.php?action=informal_repay"
                
             }
             console.log(id);
            var pushrepay = {
                repayid: id,
                period: periodi,
                data_payed: app.payDate,
                amount_payed: app.amtPay,
                nowdate: paydate,
                nextdate: nextdate,
                pay_mtd: pay_mtd,
                pay_bank: pay_bank
            }

            console.log(pushrepay)
            console.log(app.empStatus)
            var formData = app.toFormData(pushrepay);
            // axios.post("https://altara-api.herokuapp.com/api.php?action="+repay+","+ formData)
                  axios.post(api_link, formData)
                .then(function (response) {
                    console.log('yes')
                    console.log(response);

                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        setTimeout(function () {
                            app.errorMessage = '';
                        }, 2000);
                    } else {
                        if (app.firstpurchase == false) {
                        }

                        app.firstpurchase = false;
                        app.successMessage = response.data.message;
                        setTimeout(function () {
                            app.successMessage = '';
                        }, 2000);
                    }
                });
        },

        // UpdateRepay: function (id) {
        //     if (app.empStatus == 'Salaried' || app.empStatus == 'formal'){
        //         app.uprepay = 'formal_uprepay';
        //      }
        //      else {
        //         app.uprepay ='informal_uprepay';
        //      }
        //     app.dataloaded = true;
        //     axios.post("https://altara-api.herokuapp.com/api.php?action="+ app.uprepay +","+ {
        //         // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=uprepay", {
        //         repay_id: id
        //     })
        //         .then(function (response) {
        //             console.log(response);
        //             if (response.data.error) {
        //                 app.errorMessage = response.data.message;
        //             } else {
        //                 console.log(response.data.orders[0])
        //                 response.data.orders[0].order_date = app.orderDate;
        //                 response.data.orders[0].repayment = app.repay_amt;

        //                 app.pushToRepay(response.data.orders[0]);
        //                 app.dataloaded = false;
        //             }
        //         });
        // },

        GainAccess: function (feature) {
            console.log(feature)
            app.submitted = true;
            var emp = app.Employee_id;

            if (!isNaN(emp.charAt(4))) {
                emp.slice(4);
                emp.slice(0, -3)
            } else if ((!isNaN(emp.charAt(5)))) {
                emp.slice(5);
                emp.slice(0, -3)
            } else {

            }
            var dat = {
                Employee_id: emp,
                Access_code: app.Access_code
            }
            var formData = app.toFormData(dat);
            console.log()
            axios.post("https://altara-api.herokuapp.com/api.php?action=aknowledge", formData)
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=aknowledge", formData)
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
                                console.log('Yes Ok')
                                console.log(app.repaydata);
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

                        } else {

                            app.errorMessage = "Access Denied, Wrong Login Details";

                            setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                        }

                    }
                });
        },

        PurchaseidCheck: function () {
            console.log(app.Customer_id);
            axios.post("https://altara-api.herokuapp.com/api.php?action=checkId", {
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=checkId", {
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
                                app.cust_type =  response.data.checklist[0].employment_status;
                                console.log(app.cust_type);
                        } else {
                            app.errorMessage = "Customer ID Doest Exist!";
                            setTimeout(function () {
                                app.errorMessage = '';
                            }, 2000);
                            app.dataloaded = false;
                        }
                    }
                });
        },

        CheckId: function () {
            app.dataloaded = true;
            console.log(app.Customer_id);
            axios.post("https://altara-api.herokuapp.com/api.php?action=checkId", {
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=checkId", {
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

                            app.CustName = response.data.checklist[0].first_name + " " + response.data.checklist[0].last_name
                            app.address = response.data.checklist[0].add_houseno + ", " + response.data.checklist[0].add_street + ", " + response.data.checklist[0].area_address + ", Ibadan, Oyo state";
                            app.phoneNo = response.data.checklist[0].telephone;
                            app.empStatus = response.data.checklist[0].employment_status;
                            // app.CheckDoc(app.Customer_id)
                           
                            app.CustomerOrders();
                            
                            //sqlDate in SQL DATETIME format ("yyyy-mm-dd hh:mm:ss.ms")
                            var sqlDateArr1 = response.data.checklist[0].date_of_registration.split("-");
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
                    }
                });
        },

        CheckDoc: function (customer) {
            console.log(customer)
            axios.post("https://altara-api.herokuapp.com/api.php?action=checkDoc", {
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=checkDoc", {
                Customer_id: customer,
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        setTimeout(function () {
                            app.errorMessage = '';
                        }, 2000);
                    } else {
                        if (response.data.checklist.length != 0) {
                            app.check_ut = response.data.checklist[0].utility;
                            app.check_id = response.data.checklist[0].id_proof;
                            app.check_bs = response.data.checklist[0].banks;
                            app.check_pp = response.data.checklist[0].passport;
                            app.check_gc = response.data.checklist[0].gcheque;
                            app.w_guar = response.data.checklist[0].work_guarantor;
                            app.p_guar = response.data.checklist[0].personal_gua;
                            app.store_v = response.data.checklist[0].store_visited;
                        }

                        else {
                            // app.errorMessage = "Customer ID Doest Exist!";
                            // // app.sendNotification(name, telnumber)
                            // setTimeout(function() {
                            //     app.errorsMessage = '';
                            // }, 2000);
                            // app.dataloaded = false;
                        }
                        app.successMessage = response.data.message;
                        // app.sendNotification(name, telnumber)
                        setTimeout(function () {
                            app.successMessage = '';
                        }, 2000);

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
            
            console.log(app.empStatus);
            var api_link; 
            if (app.empStatus == 'Salaried' || app.empStatus == 'formal'){
                
               api_link =  "https://altara-api.herokuapp.com/api.php?action=formal_orders"
            //    api_link =  "http://localhost/AltaraCredit/altara_api/api.php?action=formal_orders"
            }
            else {
               api_link =  "https://altara-api.herokuapp.com/api.php?action=informal_orders"
            //    api_link =  "http://localhost/AltaraCredit/altara_api/api.php?action=informal_orders"
            }
            // axios.post("https://altara-api.herokuapp.com/api.php?action=" + app.status + ","+ {
                axios.post(api_link, {
                Customer_id: app.Customer_id
            })
                .then(function (response) {
                    // console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.idchecked = true;
                        console.log(response.data)
                        if (response.data.orders.length != 0) {
                            app.orderList = response.data.orders
                        }
                    }
                });
        },

        updateStore: function (psku, pdate, seller) {
            axios.post("https://altara-api.herokuapp.com/api.php?action=upstore", {
                // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=upstore", {
                product_sku: psku,
                purchase_date: pdate,
                seller_id: seller
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                    }
                });
        },

        priceCal(mPrice,plan,c_cust) {
            let dPrice ;
            let rPrice;
            let afInt;
            let pInt ;
            let aTax;
            let upFront ;
            let rePay;
            let mRepay;
            let int ;
            console.log(mPrice);
            let margin = 0.25;
            mPrice = (mPrice*margin) + Number(mPrice);
            console.log(mPrice)
            int = (plan == 0) ? 3.3 : 3;
            dPrice = (plan == 0) ? 0 : mPrice * (plan/100);
            // console.log(dPrice)
            rPrice = mPrice - dPrice;
            // console.log(rPrice)
            afInt =  (rPrice * (int/100))*12;
            // console.log(afInt);
            pInt = afInt + dPrice + rPrice;
            // console.log(pInt);
            aTax = ((0.05 * pInt) + pInt);
            upFront =  (plan == 0) ? 0 : aTax * (plan/100);
            rePay = aTax - upFront;
            mRepay = (c_cust =='formal' || c_cust =='Salaried')? rePay/6 :rePay/12;
            
            console.log ('Total Price = '+ aTax);
            console.log ('UpFront = '+ upFront);
            console.log ('Montly Repayment = '+ mRepay);

            app.purchase.product_price = Math.round( aTax * 10) / 10 ;
            app.purchase.down_pay = Math.round( upFront * 10) / 10 ;
            app.purchase.repaymt = Math.round( mRepay * 10) / 10 ;
        },

        pushToRepay: function (selectedOrder) {

            app.repay_date = [];
            console.log(app.repay_date);
            app.selected_order = selectedOrder;
            app.orderDate = selectedOrder.order_date;
            app.repay_amt = selectedOrder.repayment_amount;

            if (app.empStatus == 'Salaried' || app.empStatus == 'formal'){
                app.repaydata = [
                    { period: '1st', status: selectedOrder.first },
                    { period: '2nd', status: selectedOrder.second },
                    { period: '3rd', status: selectedOrder.third },
                    { period: '4th', status: selectedOrder.fourth },
                    { period: '5th', status: selectedOrder.fifth },
                    { period: '6th', status: selectedOrder.sixth },
                ]
             }
             else {
                app.repaydata = [
                    { period: '1st', status: selectedOrder.first },
                    { period: '2nd', status: selectedOrder.second },
                    { period: '3rd', status: selectedOrder.third },
                    { period: '4th', status: selectedOrder.fourth },
                    { period: '5th', status: selectedOrder.fifth },
                    { period: '6th', status: selectedOrder.sixth },
                    { period: '7th', status: selectedOrder.seventh },
                    { period: '8th', status: selectedOrder.eight },
                    { period: '9th', status: selectedOrder.nineth },
                    { period: '10th', status: selectedOrder.tenth },
                    { period: '11th', status: selectedOrder.eleventh },
                    { period: '12th', status: selectedOrder.twelveth }
                ]
             }
           console.log(app.repaydata);
            console.log(app.orderDate);
            var date = new Date(app.orderDate);
             var a ;
             if (app.empStatus == 'Salaried' || app.empStatus == 'formal'){
                a = [28, 56, 84, 112, 140, 168];
                for (i = 0; i <= 5; i++) {
                    var ans = app.formatDate(app.addDays(date, a[i]));
                    app.repay_date.push(ans);
                }
             }
             else {
                a = [14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168];
                for (i = 0; i <= 11; i++) {
                    var ans = app.formatDate(app.addDays(date, a[i]));
                    app.repay_date.push(ans);
                }
             }

            for (i = 0; i < app.repay_date.length; i++) {
                app.repaydata.forEach(element => {
                    if (app.repaydata.indexOf(element) == i) {
                        element.date = app.repay_date[i]
                    }
                });
            }

            app.repaydata = app.repaydata.filter(function (el) {
                return el.status == null;
            });

            console.log(app.repaydata);
        },

        addDays: function (date, days) {
            var result = new Date(date);
            result.setDate(date.getDate() + days);
            return result;
        },

        formatDate: function (date) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        },

        Repayment: function (list) {
            app.repay = list;
            console.log(app.repay);
        },

        // checkCust: function () {
        //     if (app.CheckCusId == '') {
        //         app.errorMessageChk = "Field can't be empty";
        //         setTimeout(function () {
        //             app.errorMessageChk = '';
        //         }, 1000);

        //     } else {
        //         console.log(app.CheckCusId);
        //         axios.post("https://wafcolapi.herokuapp.com/api.php?action=checkId", {
        //             // axios.post("http://localhost/AltaraCredit/altara_api/api.php?action=checkId", {
        //             Customer_id: app.CheckCusId
        //         })
        //             .then(function (response) {
        //                 console.log(response);
        //                 if (response.data.error) {
        //                     app.errorMessageChk = response.data.message;

        //                     setTimeout(function () {
        //                         app.errorMessageChk = '';
        //                     }, 1000);

        //                 } else {
        //                     app.checKiD = response.data.checklist;
        //                     if (app.checKiD.length != 0) {
        //                         app.showGuaForm = true;
        //                         // app.SelectedGuaData = app.checKiD;
        //                         // console.log(app.SelectedGuaData);

        //                         app.CustName = response.data.checklist[0].first_name + " " + response.data.checklist[0].last_name
        //                         // app.phoneNo = response.data.checklist[0].telephone
        //                     } else {
        //                         app.errorMessageChk = "Customer ID doesnt exist!";

        //                         setTimeout(function () {
        //                             app.errorMessageChk = '';
        //                         }, 1000);
        //                     }
        //                     // app.ApproveCustomer(app.CustName, app.phoneNo);
        //                     // app.Customer_id = "";

        //                 }
        //             });
        //     }
        // },

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