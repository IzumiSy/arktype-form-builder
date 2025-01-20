# arktype-form-builder

Building forms from [Arktype](https://arktype.io/) schema

## Install

```bash
npm install --save @arktype-form-builder/core
```

## Example

Think you have an Arktype schema as follows:

```tsx
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
```

### Automated form

`FormBuilder` component without children props automatically renders the all fields.

```tsx
const AutomatedForm = () => (
  <FormBuilder value={user} onSubmit={(data) => console.log(data)} />
);
```

### Custom form

Through children props, you can get two components. 

* `Field` is a component to render the field by the field name in the schema
* `Submit` is a component to render the submit button

Thanks to Arktype, `name` prop in `Field` is fully typed!

```tsx
const CustomForm = () => (
  <FormBuilder value={user} onSubmit={(data) => console.log(data)}>
    {({ Field, Submit }) => (
      <>
        <Field name="name" />
        <Field name="email" />
        <Submit />
      </>
    )}
  </FormBuilder>
);
```

### Hooks

If you don't like nests in the component, `useFormBuilder` is available to use `FormBuilder` as a hook style.

```tsx
const CustomFormWithHook = () => {
  const { Field, Submit } = useFormBuilder({
    value: user,
  });

  return (
    <>
      <Field name="email" label="Email (ad-hoc label)" />
      <Field name="name" />
      <Submit />
    </>
  );
};
```

## Customization

If you need more customization for each field, it provides render props.

```tsx
<FormBuilder value={user} onSubmit={(data) => console.log(data)}>
  {({ Field, Submit }) => (
    <>
      <Field name="name" />
      <Field
        name="email"
        render={(props) => {
          return <input {...props.field} type="email" />;
        }}
      />
      <Submit />
    </>
  )}
</FormBuilder>
```

arktype-form-builder internally uses [react-hook-form](https://react-hook-form.com/) to manage form states, so accessing `props.field` can get the form controller.
