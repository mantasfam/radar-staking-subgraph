import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Transaction, Account } from "../../generated/schema";

export function createTransaction(
  txHash: Bytes,
  account: Account,
  timestamp: BigInt,
  block: BigInt,
  day: string
): Transaction {
  let transaction = new Transaction(txHash.toHexString());
  transaction.account = account.id;
  transaction.timestamp = timestamp;
  transaction.block = block;
  transaction.day = day;
  transaction.save();

  return transaction;
}

export function getTransaction(txHash: Bytes): Transaction | null {
  let transaction = Transaction.load(txHash.toHexString());

  return transaction;
}
