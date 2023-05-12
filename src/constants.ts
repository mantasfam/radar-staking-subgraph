import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000");

export const BIG_INT_ZERO = BigInt.fromI32(0);

export const BIG_INT_ONE = BigInt.fromI32(1);

export const BIG_DEC_ZERO = BigDecimal.zero();

export const BIG_DECIMAL_1E18 = BigDecimal.fromString("1e18");
