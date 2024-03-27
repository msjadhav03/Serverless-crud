import * as yup from "yup";
export const employeeSchema = yup.object().shape({
  name: yup.string().required().max(50),
  organization: yup.string().required().max(50),
});
