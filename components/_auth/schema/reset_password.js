module.exports = {
  type: 'object',
  properties: {
    newpassword: { type: 'string', 'minLength': 6},
    renewpassword: { type: 'string', 'minLength': 6},
  },
  required: ['newpassword', 'renewpassword'],
  additionalProperties: false,
};