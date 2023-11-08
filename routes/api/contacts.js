const express = require("express");

const router = express.Router();
const ctrl = require("../../controllers/contacts");
const { isValidId, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/contact");
router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateStatusSchema),
  ctrl.updateStatusContact
);

module.exports = router;
