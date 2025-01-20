import { type as arktype } from "arktype";
import { FormBuilder, useFormBuilder } from "@arktype-form-builder/core";

const user = arktype({
  name: arktype("string > 0").configure({
    label: "Name",
  }),
  email: arktype("string > 0").configure({
    label: "E-mail",
  }),
  "category?": arktype("'admin' | 'staff'"),
});

const AutomatedForm = () => (
  <>
    <p style={{ fontWeight: "bold" }}>Automated form</p>
    <FormBuilder value={user} />
  </>
);

const CustomForm = () => (
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

const CustomFormWithHook = () => {
  const { Field, Submit } = useFormBuilder({
    value: user,
  });

  return (
    <>
      <p style={{ fontWeight: "bold" }}>Custom form with hook</p>
      <Field name="email" label="Email (ad-hoc label)" />
      <Field name="name" />
      <Submit />
    </>
  );
};

const App = () => {
  return (
    <div style={{ padding: "15px" }}>
      <AutomatedForm />
      <CustomForm />
      <CustomFormWithHook />
    </div>
  );
};

export default App;
