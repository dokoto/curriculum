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
const constants = require('../../../assets/config/constants');
const simpleParser = require('mailparser').simpleParser;

class Mailer {
    constructor(options) {
        this.options = options || {};
    }

    send(to, cc, subject, message, pathToAttachment) {
        this._setMailData(to, cc, subject, message, pathToAttachment);
        let secretContent = fs.readFileSync(path.resolve(__dirname, '../../../assets/config/', constants.GMAIL.SECRET_PATH), 'utf8');
        this._autorize(JSON.parse(secretContent), this._autorizeSuccessHandler.bind(this));
    }

    _setMailData(to, cc, subject, message, pathToAttachment) {
        this.options.to = to;
        this.options.cc = cc;
        this.options.subject = subject;
        this.options.message = message;
        this.options.pathToAttachment = pathToAttachment;
    }

    _autorize(credentials, handler) {
        let clientSecret = credentials.installed.client_secret;
        let clientId = credentials.installed.client_id;
        let redirectUrl = credentials.installed.redirect_uris[0];
        let auth = new googleAuth();
        let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        try {
            let token = fs.readFileSync(constants.GMAIL.TOKEN_PATH, 'utf8');
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
            scope: constants.GMAIL.SCOPES
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
            fs.mkdirSync(path.dirname(constants.GMAIL.TOKEN_PATH));
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFileSync(constants.GMAIL.TOKEN_PATH, JSON.stringify(token));
        console.printf('[MAILER] Token stored to ' + constants.GMAIL.TOKEN_PATH);
    }

    _autorizeSuccessHandler(auth) {
        try {
            this._sendEmail(auth);
        } catch (error) {
            console.error(error);
        }
    }

    _composeRFC5322(to, cc, subject, message) {
        let msg = 'To: ' + to.join(',') + '\r\n';
        msg += 'CC: ' + cc.join(',') + '\r\n';
        msg += 'Subject: ' + subject + '\r\n';
        msg += 'MIME-Version: 1.0' + '\r\n';
        msg += 'Content-Type: text/html; charset=UTF-8' + subject + '\r\n';
        msg += '\r\n' + message;

        return Base64.encodeURI(msg, 'base64');
    }

    _newcomposeRFC5322(to, cc, subject, message, pathToAttachment) {
        let emailHeaders = [];
        const boundary = 'end_part';
        emailHeaders.push(sprintf('Content-Type: %s; boundary="%s"\r\n', 'multipart/mixed', boundary));
        emailHeaders.push(sprintf('MIME-Version: %s\r\n', '1.0'));
        emailHeaders.push(sprintf('To: %s\r\n', to));
        emailHeaders.push(sprintf('Subject: %s\r\n\r\n', subject));

        emailHeaders.push(sprintf('--%s\r\n', boundary));
        emailHeaders.push(sprintf('Content-type: %s\r\n', ['text/html', 'charset="UTF-8"'].join(';')));
        emailHeaders.push(sprintf('MIME-Version: %s\r\n', '1.0'));
        emailHeaders.push(sprintf('Content-Transfer-Encoding: %s\r\n\r\n', '7bit'));
        emailHeaders.push(sprintf('%s\r\n\r\n', message));

        emailHeaders.push(sprintf('--%s\r\n', boundary));
        emailHeaders.push(sprintf('Content-type: %s\r\n', ['application/pdf'].join(';')));
        emailHeaders.push(sprintf('MIME-Version: %s\r\n', '1.0'));
        emailHeaders.push(sprintf('Content-Transfer-Encoding: %s\r\n', 'base64'));
        emailHeaders.push(sprintf('Content-Disposition: %s\r\n\r\n', ['attachment', 'filename="cv.pdf"'].join(';')));
        emailHeaders.push(new Buffer(fs.readFileSync(pathToAttachment)).toString('base64'));
        emailHeaders.push('\r\n\r\n');
        emailHeaders.push(sprintf('--%s--', boundary));


        simpleParser(emailHeaders.join(''), (err, mail) => {
            if (err) {
                console.error('[EMAIL] %s', JSON.stringify(err));
            }
            //console.printf('[PARSE] %s', JSON.stringify(mail));
        });

        return Base64.encodeURI(emailHeaders.join(''), 'base64');
    }

    _sendEmail(auth, contacts) {
        let gmail = google.gmail('v1');
        let RFC5322Message = this._newcomposeRFC5322(this.options.to, this.options.cc, this.options.subject, this.options.message, this.options.pathToAttachment);
        gmail.users.messages.send({
            'auth': auth,
            'userId': 'me',
            'resource': {
                'raw': RFC5322Message
            }
        }, function(err, response) {
            if (err) {
                console.error('The API returned an error > ' + err);
                return;
            }
            //console.printf(JSON.stringify(response));
        });
    }
}


module.exports = Mailer;
