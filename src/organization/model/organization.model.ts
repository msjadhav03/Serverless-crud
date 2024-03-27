import * as yup from "yup";
export const organizationSchema = yup.object().shape({
  name: yup.string().required().max(50),
});
