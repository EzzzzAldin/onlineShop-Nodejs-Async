const Joi = require('joi');

exports.validateRegistarAdmin = data => {
    const schema = Joi.object({
        name: Joi.string()
                 .min(6)
                 .required(),
        email: Joi.string()
                  .email()
                  .required(),
        password: Joi.string()
                   .min(6)
                   .required(),
        repeat_password: Joi.ref('password')
    });

    return schema.validateAsync(data);
};

exports.validateLogin = data => {
    // Create Schema
    const schema = Joi.object({
        email: Joi.string()
                  .email()
                  .required(),
        password: Joi.string()
                     .min(6)
                     .required()
    });
    return schema.validateAsync(data);
};

exports.validatepostAddProduct = data => {
    const schema = Joi.object({
        name: Joi.string()
                 .required(),
        price: Joi.number()
                  .min(1)
                  .required(),
        category: Joi.string()
                     .required(),
        description: Joi.string()
                     .required(),
        image: Joi.string(),
        discount: Joi.number()
                  .min(0)          
    });

    return schema.validateAsync(data);
};

exports.validateEditProduct = data => {
    const schema = Joi.object({
        id: Joi.string()
               .required(), 
        name: Joi.string()
                 .required(),
        price: Joi.number()
                  .min(1)
                  .required(),
        category: Joi.string()
                     .required(),
        description: Joi.string()
                     .required(),
        image: Joi.string(),
        discount: Joi.number()
                  .min(0)          
    });

    return schema.validateAsync(data);
};

exports.validatePostCart = data => {
    const schema = Joi.object({
        name: Joi.string()
                 .required(),
        price: Joi.number()
                  .required(),
        amount: Joi.number()
                   .required(),
        productId: Joi.string()
                   .required() 
    });

    return schema.validateAsync(data)
};

exports.validateEditCart = data => {
    const schema = Joi.object({
        productId: Joi.string()
                      .required(),
        amount: Joi.number()
                   .required()    
    });

    return schema.validateAsync(data)
};

exports.validateDeleteCart = data => {
    const schema = Joi.object({
        productId: Joi.string()
                      .required()
    });

    return schema.validateAsync(data)
};

exports.validatePostOrder = data => {
    const schema = Joi.object({
        name: Joi.string()
                 .required(),
        price: Joi.number()
                  .required(),
        amount: Joi.number()
                   .required(),
        productId: Joi.string()
                   .required(),
        adderss: Joi.string()
                    .required(),
        email: Joi.string()
                  .email()
                  .required()  
    });

    return schema.validateAsync(data)
};

exports.validatePostOrderAdmin = data => {
    const schema = Joi.object({
        orderId: Joi.string()
                    .required(),
        status: Joi.string()
                   .required()  
    });

    return schema.validateAsync(data)
};

exports.validategetUser = data => {
    // Create Schema
    const schema = Joi.object({
        email: Joi.string()
                  .email()
                  .required()
    });
    return schema.validateAsync(data);
};