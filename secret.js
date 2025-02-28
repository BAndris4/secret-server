class Secret {
    constructor(secret, expireAfterViews, expireAfter){
        this.hash = (Math.trunc(Math.random() * 8999999999) + 1000000000).toString();
        this.secret = secret;
        this.createdAt = new Date();
        this.expireAfter = new Date();
        this.expireAfter.setMinutes(this.createdAt.getMinutes() + expireAfter);
        this.expireAfterViews = Number(expireAfterViews);
    }
    
    get getHash(){
        return this.hash;
    }

    get getSecret(){
        return this.secret;
    }

    get getCreatedAt(){
        return this.createdAt;
    }

    get getExpireAfter(){
        return this.expireAfter;
    }

    get getExpireAfterViews(){
        return this.expireAfterViews;
    }

    toString(){
        return `Secret{hash: ${this.hash}, secretText: ${this.secretText}, createdAt: ${this.createdAt}, expireAfter: ${this.expireAfter}}, expireAfterViews: ${this.expireAfterViews}`;
    }
}

module.exports = Secret;