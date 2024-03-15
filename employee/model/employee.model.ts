import * as yup from "yup";
export const employeeSchema = yup.object().shape({
  name: yup.string().required(),
  organization: yup.string().required(),
});
