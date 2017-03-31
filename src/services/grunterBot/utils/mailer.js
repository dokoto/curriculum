'use strict';

/*
 * COMO GMAIL: http://pcarion.com/2015/12/06/gmail-api-node/
 */

const Base64 = require('js-base64').Base64;
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const constants = require('../constants');

class Mailer {
    constructor(options) {
        this.options = options || {};
    }

    send(to, cc, subject, message) {
        this._setMailData(to, cc, subject, message);
        let secretContent = fs.readFileSync(path.resolve(__dirname, '../../../config/', constants.SECRET_PATH), 'utf8');
        this._autorize(JSON.parse(secretContent), this._autorizeSuccessHandler.bind(this));
    }

    _setMailData(to, cc, subject, message) {
        this.options.to = to;
        this.options.cc = cc;
        this.options.subject = subject;
        this.options.message = message;
    }

    _autorize(credentials, handler) {
        let clientSecret = credentials.installed.client_secret;
        let clientId = credentials.installed.client_id;
        let redirectUrl = credentials.installed.redirect_uris[0];
        let auth = new googleAuth();
        let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        try {
            let token = fs.readFileSync(constants.TOKEN_PATH, 'utf8');
            console.printf('[MAILER] Token found');
            oauth2Client.credentials = JSON.parse(token);
            handler(oauth2Client);
        } catch (error) {
            console.printf('[MAILER] Token not found');
            this._getNewToken(oauth2Client, handler);
        }
    }

    _getNewToken(oauth2Client, handler) {
        let authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.options.gmail.scopes
        });
        console.printf('[MAILER] Authorize this app by visiting this url: ' + authUrl);
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('[MAILER] Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
                if (err) {
                    console.printf('[MAILER] Error while trying to retrieve access token ' + err);
                    return;
                }
                oauth2Client.credentials = token;
                this._storeToken(token);
                handler(oauth2Client);
            }.bind(this));
        }.bind(this));
    }

    _storeToken(token) {
        try {
            fs.mkdirSync(path.dirname(constants.TOKEN_PATH));
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFileSync(constants.TOKEN_PATH, JSON.stringify(token));
        console.printf('[MAILER] Token stored to ' + constants.TOKEN_PATH);
    }

    _autorizeSuccessHandler(auth) {
        try {
            this._sendEmail(auth);
        } catch (error) {
            console.error(error);
        }
    }

    _composeEMAIL(to, cc, subject, message) {
        let msg = 'To: ' + to.join(',') + '\r\n';
        msg += 'CC: ' + cc.join(',') + '\r\n';
        msg += 'Subject: ' + subject + '\r\n';
        msg += 'MIME-Version: 1.0' + '\r\n';
        msg += 'Content-Type: text/html; charset=UTF-8' + subject + '\r\n';
        msg += '\r\n' + message;

        return Base64.encodeURI(msg, 'base64');
    }

    _sendEmail(auth, contacts) {
        let gmail = google.gmail('v1');
        let RFC5322Message = this._composeEMAIL(this.options.to, this.options.cc, this.options.subject, this.options.messsage);
        gmail.users.messages.send({
            'auth': auth,
            'userId': 'me',
            'resource': {
                'raw': RFC5322Message
            }
        }, function(err, response) {
            if (err) {
                console.printf('The API returned an error: ' + err);
                return;
            }
            console.printf(JSON.stringify(response));
        });
    }
}


module.exports = Mailer;
