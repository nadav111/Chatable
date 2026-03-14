import { login as authLogin } from "./auth.service.js";
import { register as authRegister } from "./auth.service.js";

const login = async (data) => {
  const result = await authLogin(data);

  console.log(result);

  return result;
};

const register = async (data) => {
  const result = await authRegister(data);

  console.log(result);

  return result;
};

export { login, register };