const parsePostMiddleware = (req, res, next) => {
    if (req.body.post) {
      try {
        const post = JSON.parse(req.body.post);
        Object.assign(req.body, post);  // Añade los campos de "post" directamente a "req.body"
      } catch (error) {
        return res.status(400).send({ error: "Invalid JSON in post field" });
      }
    }
    next();
  };

module.exports = parsePostMiddleware;