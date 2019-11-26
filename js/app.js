var pesan = [];
var idmakanan = 0;
var total_harga = 0;
var orderID;
var Application = {
    initApplication: function() {
        $(window).load('pageinit', '#page-login', function() {
                Application.initLogin();
            }),
            $('#profile').on('click', function() {
                Application.initShowProfile(localStorage.id);
            }),
            $('#btn-login').on('click', function() {
                Application.login();
            }),
            $('#btn-regis').on('click', function() {
                Application.register();
            }),
            $('#btn-logout').on('click', function() {
                Application.logout();
            }),
            $('#btn-logout-admin').on('click', function() {
                Application.logout();
            }),
            $(document).on('click', '#detail-makanan', function() {
                var id = $(this).data('idmakanan');
                Application.initShowDetailMenu(id);
            }),
            $(document).on('click', '#detail-menu-admin', function() {
                var id = $(this).data('idmenu');
                Application.initShowDetailMenuAdmin(id);
            }),
            $('#btn-simpanMenu').on('click', function() {
                Application.tambahMenu();
            }),
            $('#btn-masukkeranjang').on('click', function() {
                Application.tambahKeCart(idmakanan);
            }),
            $('#btn-pesan').on('click', function() {
                Application.pesan();
            }),
            $('#cart').on('click', function() {
                Application.initShowCartMenu();
            }),

            $(document).on('click', '#detail-promo', function() {
                var id = $(this).data('idpromo');
                Application.initShowDetailPromo(id);
            }),
            $(document).on('click', '#detail-meja', function() {
                var id = $(this).data('idmeja');
                Application.initShowDetailMeja(id);
            }),
            $('#btn-simpanPromo').on('click', function() {
                Application.tambahPromo();
            }),
            $(window).load('pageinit', '#page-pesanan-sukses', function() {
                let params = (new URL(document.location)).searchParams;
                let nomororder = params.get("nomororder");
                console.log('load' + nomororder);
                $('#p-nomor-pesanan').text(nomororder);
            }),
            $('#promo').on('click', function() {
                Application.initShowPromo();
            }),

            $('#meja').on('click', function() {
                Application.initShowMeja();
            }),

            $('#btn-tambahMeja').on('click', function() {
                Application.initTambahMeja();
            }),

            $('#promo-user').on('click', function() {
                Application.initShowPromoUser();
            }),
            $(document).on('click', '#detail-promo-user', function() {
                var id = $(this).data('idpromouser');
                Application.initShowDetailPromoUser(id);
            }),
            $('#btn-lanjut-bayar').on('click', function() {
                window.location.href = '#page-home';
            }),
            $('#nav-pembayaran').on('click', function () {
                Application.initPesananUser();
            }),
            $('#nav-riwayat').on('click', function () {
                Application.initRiwayat();
            }),
            $(document).on('click', '#detail-pesanan', function () {
                orderID = $(this).data('orderid');
                Application.initShowDetailPesanan(orderID);
            }),
            $(document).on('click', '#btn-konfirmasi', function () {
                Application.initKonfirmasi(orderID);
            })
    },

    initLogin: function() {
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

    login: function() {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/login',
            type: 'post',
            dataType: 'json',
            data: {
                email: $('#txt-email').val(),
                password: $('#txt-password').val()
            },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });
            },
            success: function(response) {
                // alert('Login berhasil')


                localStorage.id = response.id;
                localStorage.email = response.email;
                localStorage.token = response.token;
                console.log(localStorage.id);
                // if(localStorage.token != null){
                Application.initLogin();
                // }

            },
            error: function() {
                alert('Login gagal');
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });

    },

    register: function() {
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
            beforeSend: function() {
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
            success: function(response) {
                alert('Berhasil membuat akun');
                console.log("berhasil");
                Application.initApplication();
                window.location.href = '#page-login';
            },
            error: function(xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                alert("Login gagal");
            },
            complete: function() {
                console.log("complete");
                $.mobile.loading('hide');
            }
        });

    },

    initShowMenu: function() {
        $('#list-makanan').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

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
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailMenu: function(id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
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
                $('#p-harga-makanan').text('Rp ' + dataObject.harga);
                idmakanan = dataObject.id;
                // }

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailMenuAdmin: function(id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
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
                $('#p-harga-makanan-admin').text('Rp ' + dataObject.harga);
                // }

                $('#btn-hapusMenu').on('click', function() {
                    // var id = $(this).data('idmenu');
                    Application.hapusMenu(id);
                })

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowProfile: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/user/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
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
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    logout: function() {
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
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
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
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    tambahMenu: function() {
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
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });
                console.log("before send");
            },
            success: function(response) {
                // alert('Berhasil menambahkan menu');
                console.log("berhasil");
                // $('#list-makanan-admin').empty();
                Application.initShowMenuAdmin();
                window.location.href = '#page-menu-admin';
            },
            error: function(xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                // alert("gagal");
                console.log("gagal");
            },
        });
    },

    hapusMenu: function(id) {
        console.log(id)
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/delete/menu/' + id,
            type: 'delete',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                $('#list-menu-admin').empty();
                Application.initShowMenuAdmin();
                window.location.href = '#page-menu-admin';
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },
    tambahKeCart: function(idMakanan) {
        var jumlah = $('#txt-jumlah-makanan').val();
        for (let index = 0; index < jumlah; index++) {
            pesan.push(idMakanan);
        }
        Application.initShowMenu();
        window.location.href = '#page-home';
    },

    getTotalHarga: function() {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                pesan.forEach(element => {
                    for (let index = 0; index < dataObject.length; index++) {
                        if (dataObject[index].id == element) {
                            total_harga += dataObject[index].harga;
                        }
                    }
                });

                console.log(total_harga);
                $('#p-total-harga').text('Rp ' + total_harga);

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowPromo: function() {
        $('#list-promo-admin').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
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
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },
    pesan: function() {
        var id_menu = "";
        pesan.forEach(idMenu => {
            id_menu = id_menu + idMenu + ',';
        });
        console.log(id_menu);
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/pesan',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            data: {
                total_harga: total_harga,
                id_menu: id_menu
            },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });
            },
            success: function(response) {
                alert('Berhasil membuat pesanan');
                console.log("berhasil");
                Application.initApplication();
                // alert(response.message);
                console.log('di pesan() : ' + response.nomor);
                window.location.href = '#page-pesanan-sukses?nomororder=' + response.nomor;
                let params = (new URL(document.location)).searchParams;
                let nomororder = params.get("nomororder");
                $('#p-nomor-pesanan').text(nomororder);
            },
            error: function(xhr, status, error) {
                alert("Pesan gagal");
            },
            complete: function() {
                console.log("complete");
                $.mobile.loading('hide');
            }
        });
    },

    tambahPromo: function() {
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
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait...',
                    textVisible: true
                });

                console.log("before send");
            },
            success: function(response) {
                console.log("berhasil");
                alert(response.message);
                $('#list-promo-admin').empty();
                Application.initShowPromo();
                window.location.href = '#page-promo-admin';
            },
            error: function(xhr, status, error) {
                // var err = eval("(" + xhr.responseText + ")");
                // alert("gagal");
                console.log("gagal");
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailPromo: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

                $('#p-nama-promo').text(dataObject.nama);
                $('#p-deskripsi-promo').text(dataObject.deskripsi);
                $('#p-diskon-promo').text(dataObject.potongan_harga);
                // }

                $('#btn-hapusPromo').on('click', function() {
                    // var id = $(this).data('idmenu');
                    Application.hapusPromo(id);
                })

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },
    hapusPromo: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/delete/promo/' + id,
            type: 'delete',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                alert(dataObject.message);
                Application.initShowPromo();
                window.location.href = '#page-promo-admin';
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowMeja: function() {
        $('#list-meja-admin').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/meja',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                console.log('masuk')

                for (let index = 0; index < dataObject.length; index++) {
                    // console.log(dataObject.length)
                    var status = ""
                    if (dataObject[index].status == 0) {
                        status = "Kosong"
                    } else if (dataObject[index].status == 1) {
                        status = "Penuh"
                    }

                    var appendList = '<li><a href="#detail-meja?id=' +
                        dataObject[index].nomor + '" target = "_self" id="detail-meja" data-idmeja="' +
                        dataObject[index].nomor + '"><h2> Meja ' +
                        dataObject[index].nomor + '</h2><p>Status : ' +
                        status + '</p></a></li>';
                    $('#list-meja-admin').append(appendList);
                    $('#list-meja-admin').listview('refresh');
                }
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowCartMenu: function() {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                $('#list-pesanan').empty();
                pesan.forEach(element => {
                    for (let index = 0; index < dataObject.length; index++) {
                        if (dataObject[index].id == element) {
                            var appendList = '<li><a href="" target = "_self" id="detail-makanan" data-idmakanan="' +
                                dataObject[index].id + '"><h2>' +
                                dataObject[index].nama + '</h2><p>Rp ' +
                                dataObject[index].harga + '</p></a></li>';
                            $('#list-pesanan').append(appendList);
                            $('#list-pesanan').listview('refresh');
                        }
                    }
                });
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
        Application.getTotalHarga();
    },

    initShowCartMenu: function() {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/menu',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {
                $('#list-pesanan').empty();
                pesan.forEach(element => {
                    for (let index = 0; index < dataObject.length; index++) {
                        if (dataObject[index].id == element) {
                            var appendList = '<li><a href="" target = "_self" id="detail-makanan" data-idmakanan="' +
                                dataObject[index].id + '"><h2>' +
                                dataObject[index].nama + '</h2><p>Rp ' +
                                dataObject[index].harga + '</p></a></li>';
                            $('#list-pesanan').append(appendList);
                            $('#list-pesanan').listview('refresh');
                        }
                    }
                });
            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
        Application.getTotalHarga();
    },
    initShowDetailMeja: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/show/meja/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

                var status = ""
                if (dataObject.status == 0) {
                    status = "Kosong"
                } else if (dataObject.status == 1) {
                    status = "Penuh"
                }

                $('#p-nama-meja').text("Meja " + dataObject.nomor);
                $('#p-status-meja').text(status);
                // }

                $('#btn-setMeja').on('click', function() {
                    // var id = $(this).data('idmenu');
                    Application.setStatusMeja(id);
                })

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    setStatusMeja: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/update/meja/' + id,
            type: 'put',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

                alert(dataObject.message);
                Application.initShowMeja();
                window.location.href = '#page-info-meja';

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initTambahMeja: function() {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/store/meja',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

                alert(dataObject.message);
                Application.initShowMeja();
                // window.location.href = '#page-info-meja';

            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowPromoUser: function() {
        $('#list-promo').empty();
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo',
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

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
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailPromoUser: function(id) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/promo/' + id,
            type: 'get',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            beforeSend: function() {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function(dataObject) {

                $('#p-nama-promo-user').text(dataObject.nama);
                $('#p-deskripsi-promo-user').text(dataObject.deskripsi);
                $('#p-diskon-promo-user').text(dataObject.potongan_harga);
                // }



            },
            complete: function() {
                $.mobile.loading('hide');
            }
        });
    },
    initPesananUser: function () {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/pesan',
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
                console.log(dataObject.length)
                // var appendList = ''
                for (let i = 0; i < dataObject.length; i++) {
                    var appendList = '<li><a href="#page-konfirmasi?id=' +
                        dataObject[i].nomor + '"target="_self" id="detail-pesanan" data-orderid="' +
                        dataObject[i].nomor + '"><h2><b>Order ID</b></h2><p>' +
                        dataObject[i].nomor + '</p><h2><b>Total</b></h2><p>Rp.' +
                        dataObject[i].total_harga + '</p></a></li>';
                    $("#list-pesananadmin").append(appendList);
                    $("#list-pesananadmin").listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initShowDetailPesanan: function (orderID) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/show/pesan/' + orderID,
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
                var kembalian
                $('#p-orderID').text(dataObject.nomor);
                $('#p-total').text(dataObject.total_harga);

                $('#textinput-bayar').on('input', function () {
                    var bayar = $('#textinput-bayar').val();
                    kembalian = bayar - dataObject.total_harga;
                    if (kembalian < 0) {
                        $('#p-kembalian').text(0);
                    } else {
                        $('#p-kembalian').text(kembalian);
                    }
                });

                $('#btn-konfirmasi').on('click', function () {
                    if (kembalian <= '0') {
                        alert("Nominal Bayar anda Kurang");
                    }
                    else {
                        window.location.href = "#page-paysuccess";
                    }
                });
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });

    },

    initKonfirmasi: function (orderID) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/show/pesan/' + orderID,
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
                $('#p-orderIDsuccess').text(dataObject.nomor);
                $('#p-totalbayarsuccess').text(dataObject.total_harga);
                $('#p-bayarsuccess').text($('#textinput-bayar').val());
                $('#p-kembaliansuccess').text($('#p-kembalian').text());
                Application.initSudahBayar(orderID);
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initSudahBayar: function (orderID) {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/store/pembayaran',
            type: 'post',
            dataType: 'json',
            headers: { "Authorization": localStorage.getItem('token') },
            data: {
                id: orderID
            },
            beforeSend: function () {
                $.mobile.loading('show', {
                    text: 'Please wait while retrieving data...',
                    textVisible: true
                });
            },
            success: function (dataObject) {
                alert(dataObject.message_success)
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },

    initRiwayat: function () {
        $.ajax({
            url: 'https://ppkpesenin.herokuapp.com/api/v1/users/admin/pembayaran',
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
                console.log(dataObject.length)
                // var appendList = ''
                for (let i = 0; i < dataObject.length; i++) {
                    var appendList = '<li><a href="#?id=' +
                        dataObject[i].nomor_order + '"target="_self" id="detail-pesanan" data-orderid="' +
                        dataObject[i].nomor_order + '"><h2><b>Order ID</b></h2><p>' +
                        dataObject[i].nomor_order + '</p><h2><b>Total</b></h2><p>Rp.' +
                        dataObject[i].total + '</p></a></li>';
                    $("#list-pembayaran").append(appendList);
                    $("#list-pembayaran").listview('refresh');
                }
            },
            complete: function () {
                $.mobile.loading('hide');
            }
        });
    },
};