import { beginCell, toNano } from '@ton/core';
import { OP_CODES } from '../constants';

export type WithdrawStakeParams = {
    value?: bigint;
    queryId?: number;
    withdrawAmount?: bigint;
};
/** op::stake_withdraw */
export function getWithdrawStakeMessageBody({ queryId, value, withdrawAmount }: WithdrawStakeParams) {
    return beginCell()
        .storeUint(OP_CODES.WITHDRAW_STAKE, 32) // op
        .storeUint(queryId ?? Date.now(), 64) // query_id
        .storeCoins(value ?? toNano('0.0001')) // gas_limit
        .storeCoins(withdrawAmount || 0)
        .endCell();
}

export type DepositStakeParams = {
    value?: bigint;
    queryId?: number;
};
/** op::stake_deposit */
export function getDepositStakeMessageBody({ value, queryId }: DepositStakeParams) {
    return beginCell()
        .storeUint(OP_CODES.DEPOSIT_STAKE, 32) // op
        .storeUint(queryId ?? Date.now(), 64) // query_id
        .storeCoins(value ?? toNano('0.0001')) // gas_limit
        .endCell();
}

export type RecoverStakeParams = {
    value?: bigint;
    queryId?: number;
};
/** op::stake_recover */
export function getRecoverStakeMessageBody({ queryId, value }: RecoverStakeParams) {
    return beginCell()
        .storeUint(OP_CODES.RECOVER_STAKE, 32) // op
        .storeUint(queryId ?? Date.now(), 64) // query_id
        .storeCoins(value ?? toNano('0.0001')) // gas_limit
        .endCell();
}
