(this.webpackJsonp = this.webpackJsonp || []).push([
    ["clerk-api-test"], {
        OA1K: function (t, e, s) {
            "use strict";
            s.r(e);
            s("x+9I");
            var i = s("moSR"),
                n = s.n(i);
            const {
                Component: o,
                Mixin: c
            } = Shopware;
            o.register("clerk-api-test-button", {
                template: n.a,
                props: ["label"],
                inject: ["clerkApiTest"],
                mixins: [c.getByName("notification")],
                mounted() {
                    document.getElementsByClassName('sw-meteor-page__smart-bar-title')[0].innerHTML = 'Clerk.io'
                },
                data: () => ({
                    isLoading: !1,
                    isSaveSuccessful: !1
                }),
                computed: {
                    pluginConfig() {
                        let t = this.$parent;
                        for (; void 0 === t.actualConfigData;) t = t.$parent;
                        return t.actualConfigData.null
                    }
                },
                methods: {
                    saveFinish() {
                        this.isSaveSuccessful = !1
                    },
                    check() {
                        this.isLoading = !0, this.clerkApiTest.check(this.pluginConfig).then(t => {
                            t.success ? (this.isSaveSuccessful = !0, this.createNotificationSuccess({
                                title: this.$tc("clerk-api-test-button.title"),
                                message: this.$tc("clerk-api-test-button.success")
                            })) : this.createNotificationError({
                                title: this.$tc("clerk-api-test-button.title"),
                                message: this.$tc("clerk-api-test-button.error")
                            }), this.isLoading = !1
                        })
                    }
                }
            });
            var a = s("Skhm"),
                r = s("SGsY");
            Shopware.Locale.extend("de-DE", a), Shopware.Locale.extend("en-GB", r)
        },
        SGsY: function (t) {
            t.exports = JSON.parse('{"clerk-api-test-button":{"title":"API Test","success":"Connection was successfully tested","error":"Connection could not be established. Please check the access data","button":"Test API Keys"}}')
        },
        Skhm: function (t) {
            t.exports = JSON.parse('{"clerk-api-test-button":{"title":"API Test","success":"Verbindung wurde erfolgreich getestet","error":"Verbindung konnte nicht hergestellt werden. Bitte prüfe die Zugangsdaten","button":"Test API Keys"}}')
        },
        moSR: function (t, e) {
            t.exports = '<div>\n    <sw-button-process\n        :isLoading="isLoading"\n        :processSuccess="isSaveSuccessful"\n        @process-finish="saveFinish"\n        @click="check"\n    >{{ $tc(\'clerk-api-test-button.button\') }}</sw-button-process>\n</div>\n'
        },
        "x+9I": function (t, e) {
            const s = Shopware.Classes.ApiService,
                {
                    Application: i
                } = Shopware;

            class n extends s {
                constructor(t, e, s = "clerk-api-test") {
                    super(t, e, s)
                }

                check(t) {
                    const e = this.getBasicHeaders({});
                    return this.httpClient.post(`_action/${this.getApiBasePath()}/verify`, t, {
                        headers: e
                    }).then(t => s.handleResponse(t))
                }
            }

            i.addServiceProvider("clerkApiTest", t => {
                const e = i.getContainer("init");
                return new n(e.httpClient, t.loginService)
            })
        }
    },
    [
        ["OA1K", "runtime"]
    ]
]);