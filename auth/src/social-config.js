module.exports = {
    //git detail
    gitclientId: '25930191109a85c4e5fb',
    gitclientSecret: 'f5c83db45af0333f51a727c4244a78c570b8bd46',
    gitcallbackUrl: 'http://localhost:3000/auth/github/callback',
    gitpath: '/auth/github',
    gitscope: 'user',
    //twitter detail
    twitconsumerKey: 'OUpQsC4wbg9FujW6Qkjhg0AxE',
    twitconsumerSecret: '5CojxjYWcFxD1PfOpYsZqMyfr0KlYLJ6P697BC76P86tqMqjoz',
    twitcallbackUrl: 'http://localhost:3000/auth/twitter/callback',
    twitpath: '/auth/twitter',
    //fb details
    fbappId: '171070230090248',
    fbappSecret: 'a6ae93bfa7ba0d597a33b523291f455a',
    fbcallbackUrl: 'http://localhost:3000/auth/facebook/callback',
    fbpath: '/auth/facebook',
    fbfields: 'name,email,cover,first_name',// Check fields list here: https://developers.facebook.com/docs/graph-api/reference/v2.8/user
    //google auth details
    gplusclientId: '381524561267-3agj2flmlj546qsnufj8d6283e6eismb.apps.googleusercontent.com',
    gplusclientSecret: 'KFzqxuDKfGnF91QMRHiirZwW',
    gpluscallbackUrl: 'http://localhost:3000/oauthCallback',
    gpluspath: '/auth/Gplus',
    gplusscope: 'https://www.googleapis.com/auth/plus.me'
};
