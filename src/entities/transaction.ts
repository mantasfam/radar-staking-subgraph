import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Transaction } from "../../generated/schema";

export function getOrCreateTransaction(
  txHash: Bytes,
  accountAddress: string,
  timestamp: BigInt,
  block: BigInt,
  day: string
): Transaction {
  let transactionHash = txHash.toHexString();
  let transaction = Transaction.load(transactionHash);

  if (transaction == null) {
    transaction = new Transaction(transactionHash);
    transaction.account = accountAddress;
    transaction.timestamp = timestamp;
    transaction.block = block;
    transaction.day = day;
    transaction.save();
  }

  return transaction;
}
