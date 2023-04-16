import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Transaction, Account } from "../../generated/schema";

export function createTransaction(
  txHash: Bytes,
  account: Account,
  timestamp: BigInt,
  block: BigInt
): Transaction {
  let dayStartTimestamp = (timestamp.toI32() / 86400) * 86400; // rounded

  let transaction = new Transaction(txHash.toHexString());
  transaction.account = account.id;
  transaction.timestamp = timestamp;
  transaction.block = block;
  transaction.day = dayStartTimestamp.toString();
  transaction.save();

  return transaction;
}

export function getTransaction(txHash: Bytes): Transaction | null {
  let transaction = Transaction.load(txHash.toHexString());

  return transaction;
}
