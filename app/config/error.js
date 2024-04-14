const handleError = (err, req, res, next) => {
  console.log(
    `Error at ${new Date().toISOString()}\nOn path ${req.path}\n`,
    err
  );

  return res.status(500).json({
    message: err?.message || "Something went wrong",
    error: err
  });
};

module.exports = { handleError };
