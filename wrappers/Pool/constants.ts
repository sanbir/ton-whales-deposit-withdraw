/** CONSTANTS TAKEN FROM THE CODE OF THE CONTRACT */
import {Address} from "@ton/core";

export const OP_CODES = {
    /** op::stake_withdraw */
    WITHDRAW_STAKE: 3665837821,

    /** op::stake_deposit */
    DEPOSIT_STAKE: 2077040623,
};

export const POOL_ADDRESS = Address.parse('kQAFA0sPDhFzVbhfFfAKDAsqY-KzMmklRPcGsVmhqdKxPXAm')