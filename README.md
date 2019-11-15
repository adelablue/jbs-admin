# hash_manage

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Nginx config

	# Add ```resolver 8.8.8.8;``` to http
	# Add following config to server
```
server{
    server_name admin.boogoogoo.com;
    listen          443 ssl;
    index index.html;
    root /opt/jbs-admin/;
    ssl_certificate "/etc/pki/nginx/_.boogoogoo.com.crt";
    ssl_certificate_key "/etc/pki/nginx/_.boogoogoo.com.key";
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ALL:!DH:!EXPORT:!RC4:+HIGH:+MEDIUM:!LOW:!aNULL:!eNULL;

    location / {
        index index.html;
        root /opt/jbs-admin/;
    }
    location ~* ^/api/(.*) {

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        proxy_redirect off;
        #set $upstream_endpoint https://api.boogoogoo.com;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection '';
        proxy_pass_header       Authorization;

        #proxy_set_header Host $host;
        #proxy_cache_bypass $http_upgrade;
        proxy_http_version 1.1;
        add_header 'Access-Control-Allow-Origin' '*';
	    add_header 'Access-Control-Allow-Credentials' 'true';
	    add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
	    add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';
        proxy_pass http://backend/$1$is_args$args;
    }
}
upstream backend {
    server localhost:3000;
    keepalive 8;
}

```