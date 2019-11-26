var pesan = [];
var idmakanan = 0;
var total_harga = 0;
var Application = {
    initApplication: function() {
        $(window).load('pageinit', '#page-login', function() {
                Application.initLogin();
            }),
            $(window).load('pageinit', "#page-profile", function() {
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
            });
    },

    initLogin: function() {
        console.log(localStorage.email);
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
                    text: 'Please wai...',
                    textVisible: true
                });
            },
            success: function(response) {
                // alert('Login berhasil')
                console.log("berhasil");
                1
                localStorage.id = response.id;
                localStorage.email = response.email;
                localStorage.token = response.token;
                Application.initLogin();

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
        Application.initApplication();
        window.location.href = '#page-login';
    },


    // Admin
    initShowMenuAdmin() {
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
                console.log(dataObject.length);
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
                    text: 'Please wai...',
                    textVisible: true
                });
                console.log("before send");
            },
            success: function(response) {
                // alert('Berhasil menambahkan menu');
                console.log("berhasil");
                $('#list-makanan-admin').empty();
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

    pesan: function() {
        var id_menu = "";
        pesan.forEach(idMenu => {
            id_menu = id_menu + idMenu + ',';
        });
        console.log(id_menu);
        $.ajax({
            url: 'http://127.0.0.1:8000/api/v1/users/pesan',
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
                alert(response.message);
                window.location.href = '#page-pesanan-sukses?=' + response.nomor;
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
};