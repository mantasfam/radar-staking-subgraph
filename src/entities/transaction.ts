import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";
import { Transaction } from "../../generated/schema";

export function createTransaction(
  txHash: Bytes,
  address: Address,
  timestamp: BigInt,
  block: BigInt
): boolean {
  const transactionString = txHash.toHexString();
  let transaction = Transaction.load(transactionString);
  let newTransactionFlg = false;

  if (transaction == null) {
    const dayId = timestamp.toI32() / 86400;
    transaction = new Transaction(transactionString);
    transaction.account = address.toHexString();
    transaction.timestamp = timestamp.toI32();
    transaction.block = block;
    transaction.day = dayId.toString();
    transaction.save();
    newTransactionFlg = true;
  }

  return newTransactionFlg;
}
