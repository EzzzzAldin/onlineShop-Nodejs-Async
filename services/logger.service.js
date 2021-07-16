const winston = require('winston');

// General Format Logger => date + logger level +  message

const dateFormat = () => {
    return new Date(Date.now()).toLocaleString();
};

