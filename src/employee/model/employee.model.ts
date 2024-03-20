import * as yup from "yup";
export const employeeSchema = yup.object().shape({
  name: yup.string().required().length(50),
  organization: yup.string().required().length(50),
});
