const {Component, Mixin} = Shopware;
import template from './clerk-api-test-button.html.twig';

Component.register('clerk-api-test-button', {
    template,

    props: ['label'],
    inject: ['clerkApiTest'],

    mixins: [
        Mixin.getByName('notification')
    ],

    data() {
        return {
            isLoading: false,
            isSaveSuccessful: false,
        };
    },

    mounted() {
        console.log('Mounted bitch')
    },

    computed: {
        pluginConfig() {
            let $parent = this.$parent;

            while ($parent.actualConfigData === undefined) {
                $parent = $parent.$parent;
            }

            return $parent.actualConfigData.null;
        }
    },

    methods: {
        saveFinish() {
            this.isSaveSuccessful = false;
        },

        check() {
            this.isLoading = true;
            this.clerkApiTest.check(this.pluginConfig).then((res) => {
                if (res.success) {
                    this.isSaveSuccessful = true;
                    this.createNotificationSuccess({
                        title: this.$tc('clerk-api-test-button.title'),
                        message: this.$tc('clerk-api-test-button.success')
                    });
                } else {
                    this.createNotificationError({
                        title: this.$tc('clerk-api-test-button.title'),
                        message: this.$tc('clerk-api-test-button.error')
                    });
                }

                this.isLoading = false;
            });
        }
    }
})
