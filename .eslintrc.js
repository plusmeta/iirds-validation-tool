module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": [
        "plugin:vue/recommended",
        "plugin:vuetify/recommended",
        "plugin:@intlify/vue-i18n/recommended"
    ],
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 12,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
        "allowImportExportEverywhere": true
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-debugger": process.env.VUE_APP_IS_DEBUGGING === "1" ? "off" : "error",
        "no-console": process.env.VUE_APP_IS_DEBUGGING === "1" ? "off" : "error",
        "no-alert": "error",
        "no-eq-null": "error",
        "require-await": "error",
        //"no-return-await": "error",
        "no-return-assign": ["error", "always"],
        "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],
        "indent": [
            "error",
            4,
            // Unterdrücke lint-Bug, der Fehler durch Template-Strings in wepack import() wirft
            // siehe initWorkflows()
            {
                "ignoredNodes": [
                    "TemplateLiteral"
                ]
            }
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-trailing-spaces": "error",
        "vue/valid-v-slot": ["error", {
            "allowModifiers": true
        }],
        "vue/no-mutating-props": "warn",
        "vue/v-slot-style": ["error", {
            "atComponent": "longform",
            "default": "v-slot",
            "named": "longform",
        }],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 2,
            "multiline": {
                "max": 2,
                "allowFirstLine": false
            }
        }],
        "@intlify/vue-i18n/no-raw-text": [
            "off",
            {
                "ignoreNodes": ["md-icon", "v-icon"],
                "ignorePattern": "[\\\\W]+",
                "ignoreText": ["EUR", "HKD", "USD"]
            }
        ],
        "@intlify/vue-i18n/no-missing-keys": [
            process.env.VUE_APP_IS_DEBUGGING === "1" ? "warn" : "error"
        ],
        "@intlify/vue-i18n/no-v-html":  ["off"],
        // "vuetify/no-deprecated-classes": "warn",
        // "vuetify/no-legacy-grid": "warn"
    },
    settings: {
        "vue-i18n": {
            localeDir: "./src/i18n/locales/*.{json,json5,yaml,yml}", // extension is glob formatting!
            // Specify the version of `vue-i18n` you are using.
            // If not specified, the message will be parsed twice.
            messageSyntaxVersion: "^8.0.0"
        }
    },
    overrides: [
        {
            "files": [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)"
            ],
            "env": {
                "jest": true
            }
        }
    ]
};
