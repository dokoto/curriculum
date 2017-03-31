'use strict';

module.exports = {
    APP_NAME: 'CURRICULUM',
    TELEGRAM_TOKEN: '341498560:AAEeqZZw8QoMvkAWEll51j3OdIXEzZtkzuQ',
    GMAIL: {
        SCOPES: ["https://mail.google.com/",
            "https://www.googleapis.com/auth/gmail.compose"
        ],
        SECRET_PATH: "client_secret_gmail_api.json",
        TOKEN_PATH: ".credentials/token_gmail.json"
    }
};
