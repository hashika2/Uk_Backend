const NdaService = (event) => {
  return {
    body: JSON.stringify({
      DATA: "HELLO WORLD",
    }),
  };
};

module.exports = NdaService;
