function immutableLedgerPlugin(schema) {
  const shouldEnforce = () => {
    const raw = process.env.LEDGER_IMMUTABLE;
    if (raw === undefined) return true;
    return raw === "true" || raw === "1";
  };

  const preventLedgerModification = function (next) {
    if (!shouldEnforce()) {
      return next();
    }

    return next(
      new Error(
        "Ledger entries are immutable. Create reversal entries instead of update/delete."
      )
    );
  };

  const blockedQueryOps = [
    "findOneAndUpdate",
    "updateOne",
    "updateMany",
    "findOneAndDelete",
    "deleteOne",
    "deleteMany",
    "findOneAndReplace",
  ];

  blockedQueryOps.forEach((operation) => {
    schema.pre(operation, preventLedgerModification);
  });

  schema.pre("save", function (next) {
    if (!shouldEnforce()) {
      return next();
    }

    if (!this.isNew) {
      return next(
        new Error(
          "Ledger entries are immutable. Create reversal entries instead of update/delete."
        )
      );
    }

    return next();
  });
}

export default immutableLedgerPlugin;
