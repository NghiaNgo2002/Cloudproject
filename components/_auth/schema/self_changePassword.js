module.exports = {
  type: 'object',
  properties: {
    password: { type: 'string', 'minLength': 6},
    newpassword: { type: 'string', 'minLength': 6},
    renewpassword: { type: 'string', 'minLength': 6},
  },
  required: ['password', 'newpassword', 'renewpassword'],
  additionalProperties: false,
};