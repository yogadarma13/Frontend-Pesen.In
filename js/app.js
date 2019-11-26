var Application = {
    initApplication: function () {
        $(window).load('pageinit', '#page-login', function () {
            Application.initLogin();
        }),
            // $(window).load('pageinit', "#page-promo-admin", function () {
            //     // $('#list-promo-admin').listview('refresh');
            //     Application.initShowPromo();
            // }),
            $('#profile').on('click', function(){
                Application.initShowProfile(localStorage.id);
            }),
            $('#btn-login').on('click', function () {
                Application.login();
            }),
            $('#btn-regis').on('click', function () {
                Application.register();
            }),
            $('#btn-logout').on('click', function () {
                Application.logout();
            }),
            $('#btn-logout-admin').on('click', function () {
                Application.logout();
            }),
            $(document).on('click', '#detail-makanan', function () {
                var id = $(this).data('idmakanan');
                Application.initShowDetailMenu(id);
            }),
            $(document).on('click', '#detail-menu-admin', function () {
                var id = $(this).data('idmenu');
                Application.initShowDetailMenuAdmin(id);
            }),
            $(document).on('click', '#detail-promo', function () {
                var id = $(this).data('idpromo');
                Application.initShowDetailPromo(id);
            }),
            $(document).on('click', '#detail-meja', function () {
                var id = $(this).data('idmeja');
                Application.initShowDetailMeja(id);
            }),
            $('#btn-simpanMenu').on('click', function () {
                Application.tambahMenu();
            }),
            $('#btn-simpanPromo').on('click', function(){
                Application.tambahPromo();
            })

            $('#promo').on('click', function(){
                Application.initShowPromo();
            }),

            $('#meja').on('click', function(){
                Application.initShowMeja();
            }),

            $('#btn-tambahMeja').on('click', function(){
                Application.initTambahMeja();
            }),

            $('#promo-user').on('click', function(){
                Application.initShowPromoUser();
            }),
            $(document).on('click', '#detail-promo-user', function () {
                var id = $(this).data('idpromouser');
                Application.initShowDetailPromoUser(id);
            })
    },

    initLogin: function () {
        // console.log(localStorage.email);
        if (localStorage.token != null) {
            if (localStorage.email == "admin@ub.ac.id") {
                Application.initShowMenuAdmin();
                window.location.href = '#page-menu-admin';
            } else {
                Application.initShowMenu();
                window.location.href = '#page-home';
            }
        }
    },

    login: function () {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/login',
            type: 'post',
            dataType: 'json',
            data: {
                email: $('#txt-email').val(),
                password: $('#txt-password').val()
            },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });
            },
            success: function (response) {
                // alert('Login berhasil')
                

                localStorage.id = response.id;
                localStorage.email = response.email;
                localStorage.token = response.token;
                console.log(localStorage.id);
                // if(localStorage.token != null){
                    Application.initLogin();
                // }

            },
            error: function () {
                alert('Login gagal');
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });

    },

    register: function () {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/register',
            type: 'post',
            dataType: 'json',
            data: {
                nama: $('#txt-namaRegis').val(),
                noTelephone: $('#txt-noTelpRegis').val(),
                email: $('#txt-emailRegis').val(),
                password: $('#txt-passwordRegis').val()
            },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wai...',
                    textVisible: true
                });

                var pass1 = $('#txt-passwordRegis').val();
                var pass2 = $('#txt-rePasswordRegis').val();
                if (pass1 != pass2) {
                    alert('Password tidak sama');
                    $.mobile.loading('hide');
                }
                console.log("before send");
            },
            success: function (response) {
                alert('Berhasil membuat akun');
                console.log("berhasil");
                Application.initApplication();
                window.location.href = '#page-login';
            },
            error: function (xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                alert("Login gagal");
            },
            complete: function () {
                console.log("complete");
                $.mobile.loading('hide');
            }
        });

    },

    initShowMenu: function () {
        $('#list-makanan').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                for (let index = 0; index < dataObject.length; index++) {
                    var appendList = '<li><a href="#detail-makanan?id=' +
                        dataObject[index].id + '" target = "_self" id="detail-makanan" data-idmakanan="' +
                        dataObject[index].id + '"><h2>' +
                        dataObject[index].nama + '</h2><p>Rp ' +
                        dataObject[index].harga + '</p></a></li>';
                    $('#list-makanan').append(appendList);
                    $('#list-makanan').listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailMenu: function (id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                // var test = 4;
                // var dataMakanan;
                // for (let index = 0; index < dataObject.length; index++) {
                //     if (dataObject[index].id == id) {
                //         dataMakanan = dataObject[index];
                //     }
                // }
                // if(localStorage.token != null){
                $('#p-nama-makanan').text(dataObject.nama);
                $('#p-deskripsi-makanan').text(dataObject.deskripsi);
                $('#p-harga-makanan').text(dataObject.harga);
                // }

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailMenuAdmin: function (id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                // var test = 4;
                // var dataMakanan;
                // for (let index = 0; index < dataObject.length; index++) {
                //     if (dataObject[index].id == id) {
                //         dataMakanan = dataObject[index];
                //     }
                // }
                // if(localStorage.token != null){
                $('#p-nama-makanan-admin').text(dataObject.nama);
                $('#p-deskripsi-makanan-admin').text(dataObject.deskripsi);
                $('#p-harga-makanan-admin').text(dataObject.harga);
                // }

                $('#btn-hapusMenu').on('click', function () {
                    // var id = $(this).data('idmenu');
                    Application.hapusMenu(id);
                })

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowProfile: function (id) {
        // console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/user/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                // var test = 4;
                // var dataMakanan;
                // for (let index = 0; index < dataObject.length; index++) {
                //     if (dataObject[index].id == id) {
                //         dataMakanan = dataObject[index];
                //     }
                // }
                if (localStorage.token != null) {
                    $('#p-nama-user').text(dataObject.nama);
                    $('#p-nomor-user').text(dataObject.noTelephone);
                    $('#p-email-user').text(dataObject.email);
                }

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    logout: function () {
        // headers: {"Authorization": localStorage.getItem('token')}
        localStorage.clear();
        // Application.initApplication();
        window.location.href = '#page-login';
    },


    // Admin
    initShowMenuAdmin() {
        $('#list-menu-admin').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                // console.log(dataObject.length);
                // var test = 13;
                // for (let index = 0; index < test; index++) {
                //     var appendList = '<li><a href="#detail-makanan?id=1" id="detail-makanan" data-id-makanan="1"><img src="album-bb.jpg"><h2>Nasi Goreng Rawon Gule Tepung</h2><p>Rp 25,000,-</p></a></li>';
                //     $('#list-makanan').append(appendList);
                //     var appendList = '<li><a href="#detail-makanan?id=2" id="detail-makanan" data-id-makanan="2"><img src="album-bb.jpg"><h2>Nasi Goreng Rawon Gule Tepung</h2><p>Rp 25,000,-</p></a></li>';
                //     $('#list-makanan').append(appendList);
                //     $('#list-makanan').listview('refresh');
                // }
                for (let index = 0; index < dataObject.length; index++) {
                    var appendList = '<li><a href="#detail-menu-admin?id=' +
                        dataObject[index].id + '" target = "_self" id="detail-menu-admin" data-idmenu="' +
                        dataObject[index].id + '"><h2>' +
                        dataObject[index].nama + '</h2><p>Rp ' +
                        dataObject[index].harga + '</p></a></li>';
                    $('#list-menu-admin').append(appendList);
                    $('#list-menu-admin').listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    tambahMenu: function () {
        console.log('masuk pak eko');
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/store/menu',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            data: {
                nama: $('#input-nama').val(),
                kategori: $('#input-kategori').val(),
                harga: $('#input-harga').val(),
                deskripsi: $('#input-deskripsi').val()
            },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });

                console.log("before send");
            },
            success: function (response) {
                // alert('Berhasil menambahkan menu');
                console.log("berhasil");
                // $('#list-makanan-admin').empty();
                Application.initShowMenuAdmin();
                window.location.href = '#page-menu-admin';
            },
            error: function (xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                // alert("gagal");
                console.log("gagal");
            },
        });
    },

    hapusMenu: function (id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/delete/menu/' + id,
            type: 'delete',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                $('#list-menu-admin').empty();
                Application.initShowMenuAdmin();
                window.location.href = '#page-menu-admin';
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowPromo: function(){
        $('#list-promo-admin').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                for (let index = 0; index < dataObject.length; index++) {
                    // console.log(dataObject.length)
                    var appendList = '<li><a href="#detail-promo?id=' +
                        dataObject[index].id + '" target = "_self" id="detail-promo" data-idpromo="' +
                        dataObject[index].id + '"><h2>' +
                        dataObject[index].nama + '</h2><p>Diskon : ' +
                        dataObject[index].potongan_harga + '</p></a></li>';
                    $('#list-promo-admin').append(appendList);
                    $('#list-promo-admin').listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    tambahPromo: function(){
        console.log('masuk')
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/store/promo',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            data: {
                nama: $('#input-nama-promo').val(),
                deskripsi: $('#input-deskripsi-promo').val(),
                potongan_harga: $('#input-potonganharga-promo').val(),
                jumlah_promo: $('#input-jumlah-promo').val()
            },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });

                console.log("before send");
            },
            success: function (response) {
                console.log("berhasil");
                alert(response.message);
                $('#list-promo-admin').empty();
                Application.initShowPromo();
                window.location.href = '#page-promo-admin';
            },
            error: function (xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                // alert("gagal");
                console.log("gagal");
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailPromo: function(id){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                $('#p-nama-promo').text(dataObject.nama);
                $('#p-deskripsi-promo').text(dataObject.deskripsi);
                $('#p-diskon-promo').text(dataObject.potongan_harga);
                // }

                $('#btn-hapusPromo').on('click', function () {
                    // var id = $(this).data('idmenu');
                    Application.hapusPromo(id);
                })

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },
    hapusPromo: function(id){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/delete/promo/' + id,
            type: 'delete',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                alert(dataObject.message);
                Application.initShowPromo();
                window.location.href = '#page-promo-admin';
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowMeja: function(){
        $('#list-meja-admin').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/meja',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                console.log('masuk')
                
                for (let index = 0; index < dataObject.length; index++) {
                    // console.log(dataObject.length)
                    var status = ""
                    if(dataObject[index].status == 0){
                        status = "Kosong"
                    } else if(dataObject[index].status == 1){
                        status = "Penuh"
                    }

                    var appendList = '<li><a href="#detail-meja?id=' +
                        dataObject[index].nomor + '" target = "_self" id="detail-meja" data-idmeja="' +
                        dataObject[index].nomor + '"><h2> Meja ' +
                        dataObject[index].nomor + '</h2><p>Status : ' +
                        status+ '</p></a></li>';
                    $('#list-meja-admin').append(appendList);
                    $('#list-meja-admin').listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailMeja: function(id){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/show/meja/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                var status = ""
                    if(dataObject.status == 0){
                        status = "Kosong"
                    } else if(dataObject.status == 1){
                        status = "Penuh"
                    }

                $('#p-nama-meja').text("Meja " + dataObject.nomor);
                $('#p-status-meja').text(status);
                // }

                $('#btn-setMeja').on('click', function () {
                    // var id = $(this).data('idmenu');
                    Application.setStatusMeja(id);
                })

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    setStatusMeja: function(id){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/update/meja/' + id,
            type: 'put',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                alert(dataObject.message);
                Application.initShowMeja();
                window.location.href = '#page-info-meja';

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initTambahMeja: function(){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/store/meja',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                alert(dataObject.message);
                Application.initShowMeja();
                // window.location.href = '#page-info-meja';

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowPromoUser: function(){
        $('#list-promo').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                for (let index = 0; index < dataObject.length; index++) {
                    // console.log(dataObject.length)
                    var appendList = '<li><a href="#detail-promo-user?id=' +
                        dataObject[index].id + '" target = "_self" id="detail-promo-user" data-idpromouser="' +
                        dataObject[index].id + '"><h2>' +
                        dataObject[index].nama + '</h2><p>Diskon : ' +
                        dataObject[index].potongan_harga + '</p></a></li>';
                    $('#list-promo').append(appendList);
                    $('#list-promo').listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailPromoUser: function(id){
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                
                $('#p-nama-promo-user').text(dataObject.nama);
                $('#p-deskripsi-promo-user').text(dataObject.deskripsi);
                $('#p-diskon-promo-user').text(dataObject.potongan_harga);
                // }

                

            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },
};
