import {
  StakeInitiated,
  Withdrawn,
} from "../generated/StakingRewardsProxy/StakingRewardsProxy";
import { Transaction, User } from "../generated/schema";

export function handleStakeInitiated(event: StakeInitiated): void {
  // Use transaction hash from emitted event as unique id for the entity
  const transactionId = event.transaction.hash;
  // Create a new Transaction Entity with unique id
  const transaction = new Transaction(transactionId);
  // Set Transaction Entity fields
  transaction.user = event.params.user;
  transaction.amount = event.params.amount;
  transaction.stakeFlg = true;
  transaction.withdrawFlg = false;
  // Save entity to store
  transaction.save();

  const userId = event.params.user;
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.amountStaked = event.params.amount;
    user.user = user.id;
    user.transactionCount = 1;
  } else {
    user.amountStaked = user.amountStaked.plus(event.params.amount);
    user.transactionCount++;
  }
  // Save entity to store
  user.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  // Use transaction hash from emitted event as unique id for the entity
  const transactionId = event.transaction.hash;
  // Create a new Transaction Entity with unique id
  const transaction = new Transaction(transactionId);

  // Set Transaction Entity fields
  transaction.user = event.params.user;
  transaction.amount = event.params.amount;
  transaction.stakeFlg = false;
  transaction.withdrawFlg = true;

  // Save entity to store
  transaction.save();

  const userId = event.params.user;
  let user = User.load(userId);
  user!.amountStaked = user!.amountStaked.minus(event.params.amount);
  user!.transactionCount++;
  // Save entity to store
  user!.save();
}
