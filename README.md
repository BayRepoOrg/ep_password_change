ep_password_change
==================
This plugin is an extension to the ep_hash_auth plugin (https://github.com/ether/ep_hash_auth)  
provides the functionality to change the password of user  
works only when ep_hash_auth is used with file-based storing of hashes

HTTP status codes:

204: Password succesfully changed
401: Current Password is wrong
422: Hash is stored in settings.json file
500: Internal Server Error
501: Hash File is not writable
