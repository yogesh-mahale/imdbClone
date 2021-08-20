App.controller("aesController", ["$scope", "$rootScope", "$http", "$q", function(e, t, o, r) {
    e.textToEncrypt = void 0, e.mode = "ECB", e.secretkey = void 0, e.keysize = "128", e.encryptedOutput = void 0, e.textToDecrypt = "", e.dmode = "ECB", e.dsecretkey = void 0, e.dkeysize = "128", e.decryptedString = void 0, e.decryptInputFormat = "Base64", e.encryptOutputFormat = "Base64", e.showEncryptIV = !1, e.encryptiv = void 0, e.showDecryptIV = !1, e.decryptiv = void 0, setTimeout(function() {
        "undefined" == typeof Storage || sessionStorage.getItem("newsletter") || (sessionStorage.setItem("newsletter", !0), $("#newslettermodal").modal("show"))
    }, 9e4), e.encryptModeSelected = function() {
        "CBC" === e.mode && (e.showEncryptIV = !0)
    }, e.decryptModeSelected = function() {
        "CBC" === e.dmode && (e.showDecryptIV = !0)
    },
        e.aesEncrypt = function() {
        if (e.textToEncrypt && e.file) alert("Either plain-text or image can be encrypted at a time.");
        else if ((e.textToEncrypt || e.file) && e.secretkey)
            if (e.keysize / 8 == e.secretkey.length)
                if (e.encryptiv && 16 != e.encryptiv.length) alert("Length of initialization vector must be 16 with AES.");
                else {
                    var t = new FormData;
                    t.append("file", e.file);
                    var i = {
                        textToEncrypt: e.textToEncrypt,
                        secretKey: e.secretkey,
                        mode: e.mode,
                        keySize: e.keysize,
                        dataFormat: e.encryptOutputFormat,
                        iv: e.encryptiv
                    };
                    t.append("data", JSON.stringify(i)), o.post("online-tools/aes-encryption", t, {
                        transformRequest: angular.identity,
                        headers: {
                            "Content-Type": void 0
                        }
                    }).then(function(t) {
                        e.encryptedOutput = t.data.output
                    }, function(e) {
                        return -1 == e.status && (e.status = 408, e.statusText = "Server Timeout."), alert(e.status + ":" + e.statusText), r.reject(e)
                    })
                }
            else alert("Length of secret key should be " + e.keysize / 8 + " for " + e.keysize + " bits key size");
        else alert("Required fields missing.")
    },
        e.decryptAes = function() {
        if (e.textToDecrypt && e.dsecretkey)
            if (e.dkeysize / 8 == e.dsecretkey.length)
                if (e.decryptiv && 16 != e.decryptiv.length) alert("Length of initialization vector must be 16 with AES.");
                else {
                    var t = {
                        textToDecrypt: e.textToDecrypt,
                        secretKey: e.dsecretkey,
                        mode: e.dmode,
                        keySize: e.dkeysize,
                        dataFormat: e.decryptInputFormat,
                        iv: e.decryptiv
                    };
                    o.post("online-tools/aes-decryption", t).then(function(t) {
                        e.decryptedString = t.data.output
                    }, function(e) {
                        return -1 == e.status && (e.status = 408, e.statusText = "Server Timeout."), alert(e.status + ":" + e.statusText), r.reject(e)
                    })
                }
            else alert("Length of secret key should be " + e.dkeysize / 8 + " for " + e.dkeysize + " bits key size");
        else alert("Required fields missing.")
    },

        e.base64Decrypt = function() {
        e.base64decoded = atob(e.decryptedString)
    }, e.subscribe = function(e) {
        if (e && /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e)) {
            var t = {};
            t.email = e;
            o.post("subscribe", t, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(e) {
                $("#newslettermodal").modal("toggle")
            }, function(e) {
                return -1 == e.status && (e.status = 408, e.statusText = "Server Timeout."), alert(e.status + ":" + e.statusText), r.reject(e)
            })
        } else alert("Invalid email.")
    }
}]), $(document).ready(function() {
    for (var e = document.getElementsByTagName("img"), t = 0; t < e.length; t++) e[t].getAttribute("data-src") && e[t].setAttribute("src", e[t].getAttribute("data-src"));
    var o = $("#header").height();
    $(".content-container").css("margin-top", o);
    var r = o + 20,
        i = $(".google_ad").offset().top;
    $(window).scroll(function() {
        $(window).scrollTop() >= i ? $(".google_ad").css({
            position: "fixed",
            width: "auto",
            top: r
        }) : $(".google_ad").css({
            position: "static"
        })
    })
}), App.directive("fileModel", ["$parse", function(e) {
    return {
        restrict: "A",
        link: function(t, o, r) {
            var i = e(r.fileModel).assign;
            o.bind("change", function() {
                t.$apply(function() {
                    i(t, o[0].files[0])
                })
            })
        }
    }
}]);