import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: 'us-east-2_hDJ0Eq8Mu',
    ClientId: 'j3885hbkkkbmu8kuaef5aor34'
};

export default new CognitoUserPool(poolData);
