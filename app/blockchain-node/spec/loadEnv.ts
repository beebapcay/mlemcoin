// Set the env file, must be first
import dotenv from 'dotenv';

const resultTestEnv = dotenv.config({
    path: `./src/shared/pre-start/env/test.env`
});

if (resultTestEnv.error) {
    throw resultTestEnv.error;
}
