module.exports = {
  type: 'object',
  properties: {
    fullname: { type: 'string', 'minLength': 1 },
    phonenumber: {type: 'string', 'minLength': 1},
    email: { type: 'string', format: 'email' },
    password: { type: 'string', 'minLength': 6 },
    repeatpassword: { type: 'string', 'minLength': 6 },
    agree: {type: 'string'}
  },
  required: ['fullname', 'phonenumber', 'email', 'password', 'repeatpassword', 'agree'],
  additionalProperties: false,
};