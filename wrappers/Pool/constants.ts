/** CONSTANTS TAKEN FROM THE CODE OF THE CONTRACT */
import { Address, toNano } from '@ton/core';

export const OP_CODES = {
    /** op::stake_withdraw */
    WITHDRAW_STAKE: 3665837821,

    /** op::stake_deposit */
    DEPOSIT_STAKE: 2077040623,

    /** op::stake_recover */
    RECOVER_STAKE: 1699565966,
};

export const POOL_ADDRESS = Address.parse(process.env.POOL_ADDRESS!);

export const AMOUNT_DEPOSIT = toNano(process.env.AMOUNT_DEPOSIT!);
export const AMOUNT_WITHDRAW = toNano(process.env.AMOUNT_WITHDRAW!);
