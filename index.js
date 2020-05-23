var eejs = require('ep_etherpad-lite/node/eejs/');

var crypto = require('crypto');

var fs = require('fs');

var settings = require('ep_etherpad-lite/node/utils/Settings');

var hash_typ = 'sha512';
var hash_dig = 'hex';
var hash_dir = '/var/etherpad/users';
var hash_ext = '/.hash';

if (settings.ep_hash_auth) {
    if (settings.ep_hash_auth.hash_typ) hash_typ = settings.ep_hash_auth.hash_typ;
    if (settings.ep_hash_auth.hash_dig) hash_dig = settings.ep_hash_auth.hash_dig;
    if (settings.ep_hash_auth.hash_dir) hash_dir = settings.ep_hash_auth.hash_dir;
    if (settings.ep_hash_auth.hash_ext) hash_ext = settings.ep_hash_auth.hash_ext;
}

exports.eejsBlock_indexWrapper = function(hook_name, args, cb) {
    args.content += eejs.require('ep_password_change/templates/form.html');
    args.content += eejs.require('ep_password_change/templates/button.html');
    args.content += "<link href='static/plugins/ep_password_change/static/css/modal.css' rel='stylesheet'>";
    cb();
};

exports.registerRoute = function(hook_name, args, cb) {
    args.app.get("/password_change", function(req, res) {
        if (req.query.password && req.query.current) {
            var username = req.session.user.username;
            var path = hash_dir + "/" + username + "/" + hash_ext;

            // check current password
            var path = hash_dir + "/" + username + hash_ext;
            fs.readFile(path, 'utf8', function(err, contents) {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                } else {
                    var hash = crypto.createHash(hash_typ).update(req.query.current).digest(hash_dig);
                    if (hash != contents) {
                        res.status(401).send();
                    } else {
                        // write new hash
                        var hash = crypto.createHash(hash_typ).update(req.query.password).digest(hash_dig);
                        fs.writeFile(path, hash, function(err) {
                            if (err) {
                                console.log(err);
                                res.status(500).send();
                            } else {
                                res.status(204).send();
                            }
                        });
                    }
                }
            });
       }
    });
};
