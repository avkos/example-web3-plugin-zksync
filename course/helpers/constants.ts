export const richAccount =  {
    address: "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
    privateKey: "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
}

export const DAI_L1 = '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55';
export const DAI_L2 = '0x19823b3D0ccfe3393b50491502e07300E60dde02';
export const ERC20_CROWN = '0x841c43Fa5d8fFfdB9efE3358906f7578d8700Dd4';
export const APPROVAL_TOKEN = ERC20_CROWN
export const PAYMASTER = '0xa222f0c183AFA73a8Bc1AFb48D34C88c9Bf7A174'; // Crown token paymaster

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
