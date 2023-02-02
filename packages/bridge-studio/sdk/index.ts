import hello from './/hello';
import usergetMe from './user/getMe';
import userisEmailInUse from './user/isEmailInUse';
import usersigninWithPassword from './user/signinWithPassword';
import userupdateMyPassword from './user/updateMyPassword';
import userupdateForgottenPassword from './user/updateForgottenPassword';
import userrefreshToken from './user/refreshToken';
import userlogout from './user/logout';
import userdeleteMyAccount from './user/deleteMyAccount';
import confirmationgetCodeByEmail from './confirmation/getCodeByEmail';
import githubgetMyConnectedAccounts from './github/getMyConnectedAccounts';
import githubgetReposWithTS from './github/getReposWithTS';
import githubsubscribeRepoToBridge from './github/subscribeRepoToBridge';
import deploygetLast from './deploy/getLast';
import deploytypescriptsdkget from './deploy/typescript-sdk/get';
import projectget from './project/get';
import projectgetMine from './project/getMine';
import projectupdate from './project/update';
import projectreCompile from './project/reCompile';
import projectgetFromCLI from './project/getFromCLI';
import projectcreateProjectFromCLI from './project/createProjectFromCLI';
import projectcompileWithCommandLine from './project/compileWithCommandLine';

export const API = {
  hello: hello,
  user: {
    getMe: usergetMe,
    isEmailInUse: userisEmailInUse,
    signinWithPassword: usersigninWithPassword,
    updateMyPassword: userupdateMyPassword,
    updateForgottenPassword: userupdateForgottenPassword,
    refreshToken: userrefreshToken,
    logout: userlogout,
    deleteMyAccount: userdeleteMyAccount,
  },
  confirmation: { getCodeByEmail: confirmationgetCodeByEmail },
  github: {
    getMyConnectedAccounts: githubgetMyConnectedAccounts,
    getReposWithTS: githubgetReposWithTS,
    subscribeRepoToBridge: githubsubscribeRepoToBridge,
  },
  deploy: {
    getLast: deploygetLast,
    typescriptsdk: { get: deploytypescriptsdkget },
  },
  project: {
    get: projectget,
    getMine: projectgetMine,
    update: projectupdate,
    reCompile: projectreCompile,
    getFromCLI: projectgetFromCLI,
    createProjectFromCLI: projectcreateProjectFromCLI,
    compileWithCommandLine: projectcompileWithCommandLine,
  },
};
