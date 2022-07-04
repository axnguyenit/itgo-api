function handleDataBeforeResponse() {
  const { _id, __v, ...rest } = this.toObject();
  rest.id = _id;
  return rest;
}

module.exports = { handleDataBeforeResponse };
