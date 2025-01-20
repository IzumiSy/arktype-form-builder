import { type as arktype } from "arktype";
import { FormBuilder, useFormBuilder } from "@arktype-form-builder/core";

const user = arktype({
  name: arktype("string > 0").configure({
    label: "名前",
  }),
  email: arktype("string > 0").configure({
    label: "メールアドレス",
  }),
  "category?": arktype("'admin' | 'staff'"),
});

const AutomatedForm = () => {
  return (
    <>
      <p style={{ fontWeight: "bold" }}>Automated form</p>
      <FormBuilder value={user} />
    </>
  );
};

const CustomForm = () => {
  return (
    <>
      <p style={{ fontWeight: "bold" }}>Custom form</p>
      <FormBuilder value={user} onSubmit={(data) => console.log(data)}>
        {({ Field, Submit }) => (
          <>
            <Field name="name" />
            <Field name="email" />
            <Submit />
          </>
        )}
      </FormBuilder>
    </>
  );
};

const CustomFormWithHook = () => {
  const { Field, Submit } = useFormBuilder({
    value: user,
  });

  return (
    <>
      <p style={{ fontWeight: "bold" }}>Custom form with hook</p>
      <Field name="email" label="Email (ad-hoc)" />
      <Field name="name" />
      <Submit />
    </>
  );
};

const App = () => {
  return (
    <>
      <AutomatedForm />
      <CustomForm />
      <CustomFormWithHook />
    </>
  );
};

export default App;
