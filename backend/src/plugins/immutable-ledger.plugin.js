function immutableLedgerPlugin(schema) {
  const shouldEnforce = () => {
    const raw = process.env.LEDGER_IMMUTABLE;
    if (raw === undefined) return true;
    return raw === "true" || raw === "1";
  };

  // Block update and delete operations
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
    schema.pre(operation, async function () {
      if (shouldEnforce()) {
        throw new Error(
          "Ledger entries are immutable. Create reversal entries instead of update/delete."
        );
      }
    });
  });

  // Block updates on existing documents
  schema.pre("save", async function () {
    if (shouldEnforce() && !this.isNew) {
      throw new Error(
        "Ledger entries are immutable. Create reversal entries instead of update/delete."
      );
    }
  });
}

export default immutableLedgerPlugin;
