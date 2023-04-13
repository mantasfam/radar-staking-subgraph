import { Address } from "@graphprotocol/graph-ts";
import { Account } from "../../generated/schema";
import { BIG_INT_ZERO } from "../constants";

export function getOrCreateAccount(address: Address): Account {
  let accountAddress = address.toHexString();
  let account = Account.load(accountAddress);

  if (account == null) {
    account = new Account(accountAddress);
    account.address = address;
    account.currentStakeAmount = BIG_INT_ZERO;
    account.totalHarvestAmount = BIG_INT_ZERO;
    account.totalStakeEvents = BIG_INT_ZERO;
    account.totalUnstakeEvents = BIG_INT_ZERO;
    account.totalHarvestEvents = BIG_INT_ZERO;
    account.save();
  }

  return account;
}
