module.exports = {
  type: 'object',
  properties: {
    fullname: { type: 'string', 'minLength': 1 },
    phonenumber: {type: 'string', 'minLength': 1 },
    email: { type: 'string', format: 'email' },
  },
  required: ['fullname', 'phonenumber', 'email'],
  additionalProperties: false,
};